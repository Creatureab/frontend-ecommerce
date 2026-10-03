# E-Commerce Project Architecture

This document lives at the root of `frontend/` and describes the current application, important behavior and security issues to address, and a practical target for organizing its pages, features, and components. Fix the correctness and security issues before restructuring the frontend.

## Current application

The project has two applications:

- **Frontend:** Next.js App Router and React, in `frontend/`.
- **API:** Express, with MongoDB accessed through Mongoose, in the project root.

The frontend calls the API through `lib/api.ts` and the shared HTTP transport in `lib/api-client.ts`. `lib/config.ts` uses `NEXT_PUBLIC_API_URL` when it is set, otherwise it falls back to `/api/v1`. `next.config.ts` rewrites requests matching `/api/:path*` to `http://localhost:5000/api/:path*`.

**Important environment behavior:** `frontend/.env.local` currently sets `NEXT_PUBLIC_API_URL` to an absolute Render API URL. With that setting, the browser calls Render directly and the Next.js rewrite is bypassed. The rewrite is used only when the API URL falls back to a relative path (or is otherwise configured as a relative URL). Direct browser-to-API requests depend on the API's CORS configuration. Keep real environment values and secrets out of this document and out of version control.

```text
Browser
  -> Next.js route in frontend/app/
  -> page or feature UI
  -> lib/api.ts (compatibility facade) or features/<name>/api.ts
  -> lib/api-client.ts
  -> absolute NEXT_PUBLIC_API_URL (current frontend/.env.local)
     OR relative /api/v1/... -> Next.js rewrite -> localhost:5000
  -> Express router in routes/
  -> controller/route logic and models/
  -> MongoDB
```

## Migration progress

Refactoring is incremental. Current status:

| Area | Status |
| --- | --- |
| Feature API modules (`features/*/api.ts`) | Done — auth, catalog, categories, orders, admin/users |
| `lib/api.ts` compatibility facade | Done — re-exports feature APIs for legacy imports |
| Catalog UI (`features/catalog/components/`) | Done — `CatalogPage`, toolbar, grid, card, pagination |
| Shared layout (`components/layout/SiteHeader`) | Done — extracted from home page |
| Route protection gates | Done — `AuthGate`, `AdminGate` (admin layout) |
| Checkout hardening | Done — profile sync before order, cart cleared only after valid order ID |
| Priority 0 backend security | Done — role lockdown, password hashing path, logging cleanup |
| Remaining page UI refactors | Pending — cart, checkout, orders, profile, auth pages, admin CRUD |
| Server Components adoption | Pending — interactive pages remain client components for now |

Note: categories live in `features/categories/api.ts` (shared list endpoint used by catalog and admin). Admin CRUD pages are not yet split into `features/admin/*` UI modules.

## Existing frontend routes

| Route | Responsibility |
| --- | --- |
| `/` | Product catalog, search, category filter, and add-to-cart |
| `/products/[id]` | Product details |
| `/cart` | Cart contents and quantity changes |
| `/checkout` | Create an order from the cart |
| `/orders/[id]` | Order details |
| `/login`, `/register` | Authentication |
| `/profile` | Profile and customer orders |
| `/admin` | Admin landing page |
| `/admin/products` | Product management |
| `/admin/categories` | Category management |
| `/admin/orders` | Order management |
| `/admin/users` | User management |

The current code has reusable UI primitives in `components/ui/`, shared authentication and cart providers in `contexts/`, API helpers in `lib/` and `features/*/api.ts`, and route entry points in `app/`. The home route (`app/page.tsx`) now composes `CatalogPage`; most other route pages still combine data fetching, state, event handlers, and large sections of UI in a single file.

## Priority 0: security and behavior fixes

Complete these before moving additional components or API modules. Route protection in the frontend is for user experience only; enforce every permission and invariant in the Express API.

1. **Prevent privilege assignment and self-promotion.** ~~`validators/auth.validator.js` accepts an optional `role`…~~ **Resolved:** registration whitelists fields and always sets `role: "user"`; profile and admin generic updates reject `role`; role changes stay on `PATCH /api/v1/admin/users/:id/change-role` with self-demotion and last-admin safeguards.
2. **Hash passwords on every write path.** ~~Admin update route uses `findByIdAndUpdate`…~~ **Resolved:** admin user updates load the document, assign allowed fields, and call `.save()` so the Mongoose password hash hook runs.
3. **Agree on API contracts before typing or moving API functions.** Record each endpoint's request, status codes, and response envelope, then use those contracts in frontend types and tests. **Order creation — partially resolved:** backend returns `{ message, data: populatedOrder }`; frontend types use `OrderCreationResponse` and checkout reads `response.data.id`. Remaining work: verify list/item order envelopes and finish the contract inventory table below.
4. **Make checkout and redirects depend on confirmed results.** **Resolved for checkout:** shipping fields update the user profile before order creation (orders use the authenticated user's profile address); cart clears only after a valid order ID is returned; failed requests keep the cart intact. Protected routes should use `AuthGate` / `AdminGate` or layout wrappers rather than ad-hoc render-time redirects where possible.
5. **Remove sensitive authentication logging.** **Resolved:** verbose auth middleware logging and registration user dumps removed. Do not reintroduce logs that include passwords, hashes, or tokens.

Add or update regression coverage for role assignment through registration and profile updates, admin role changes, password hashing, order response parsing, and failed/successful checkout navigation before large structural changes. No automated test suite exists yet (`npm test` is a placeholder).

### Checkout behavior notes

- The checkout form collects shipping/contact fields. The order API does not accept a separate shipping payload; it associates the order with the authenticated user and populates address fields from the user profile. Checkout therefore calls `PUT /api/v1/auth/profile` with the form values immediately before `POST /api/v1/orders`.
- Order totals and tax are computed on the backend from database prices. The checkout summary tax display is presentational only; do not treat client-side totals as authoritative.
- Clear the cart only after confirming `response.data.id` exists.

### Contract inventory to establish

Use the backend routes as the source of truth and document/verify each contract before changing its frontend consumer:

| Capability | Backend route | Contract detail to verify |
| --- | --- | --- |
| Register | `POST /api/v1/auth/register` | Registration fields; role is always `user`; current response has `data` and top-level `token` |
| Login | `POST /api/v1/auth/login` | Current response nests `user` and `token` inside `data` |
| Profile | `GET`, `PUT /api/v1/auth/profile` | Authenticated user shape and allowed fields; profile updates must not accept `role` |
| Products | `GET`, `POST /api/v1/products` and item routes | Product shape, list/pagination envelope, and upload response |
| Categories | `GET`, `POST /api/v1/categories` and item routes | List shape versus create/update/delete response shapes |
| Orders | `POST /api/v1/orders`, list and item routes | Create response wraps the order in `data` (**aligned**); list and item response envelopes still to verify |
| Admin users | `/api/v1/admin/users` routes | Pagination envelope and which operations may change roles or passwords |

Avoid leaking tokens, passwords, or private environment values in API logs while validating these contracts.

## Recommended frontend structure

```text
frontend/
├── app/                              # URL routing and route-level composition
│   ├── layout.tsx                    # document shell and global providers
│   ├── page.tsx                      # composes the catalog feature
│   ├── products/[id]/page.tsx
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── orders/[id]/page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── profile/page.tsx
│   └── admin/...
│       └── layout.tsx                # AdminGate wrapper
├── components/
│   ├── layout/                       # site header, navigation, page shell
│   └── ui/                           # generic design primitives
├── features/
│   ├── auth/
│   │   ├── api.ts
│   │   ├── components/               # AuthGate, AdminGate
│   │   └── types.ts
│   ├── catalog/
│   │   ├── api.ts
│   │   ├── components/               # CatalogPage, ProductGrid, ProductCard, …
│   │   └── types.ts
│   ├── categories/
│   │   └── api.ts                    # shared category endpoints
│   ├── cart/
│   │   ├── components/
│   │   └── types.ts
│   ├── checkout/
│   │   ├── api.ts
│   │   └── components/
│   ├── orders/
│   │   ├── api.ts
│   │   └── components/
│   ├── profile/
│   │   ├── api.ts
│   │   └── components/
│   └── admin/
│       ├── products/
│       ├── categories/
│       ├── orders/
│       └── users/
├── contexts/                         # app-wide state providers
├── lib/
│   ├── api-client.ts                 # fetch, base URL, auth headers, errors
│   ├── api.ts                        # temporary facade during migration
│   ├── config.ts                     # public runtime configuration
│   └── utils.ts                      # generic utilities only
└── public/
```

Keep this structure proportional to the code: a feature does not need every listed file until it has logic that belongs there. Do not create a component for every small markup fragment.

## Component and file responsibilities

- **`app/` route files:** Match URLs, define route-level metadata and boundaries, and compose the relevant feature page. Keep feature-specific business logic out of route files.
- **`features/<name>/components/`:** Own UI and interactions for one business capability, such as catalog filtering or admin product editing.
- **`components/layout/`:** Own shared navigation, headers, footers, and page shells used across routes.
- **`components/ui/`:** Own generic, domain-independent controls such as buttons, inputs, labels, and cards. These should not fetch API data or know about products or orders.
- **`features/<name>/api.ts`:** Own typed endpoint functions for that feature. Keep `lib/api-client.ts` as the shared HTTP transport. Move endpoint groups out of `lib/api.ts` gradually; avoid having two competing API layers.
- **`contexts/`:** Own state that is genuinely shared across routes. Keep authentication and cart state here while they are consumed globally; keep page-only state local to the feature.
- **Types:** Put feature-specific types with their feature. Keep only genuinely shared types in a shared types module. Define request and response types instead of using `any`.

## Route protection guidance

Frontend guards improve UX; the Express API remains the authorization source of truth.

- **`AuthGate`** (`features/auth/components/AuthGate.tsx`): wrap pages that require a logged-in user (profile, checkout). Redirects to `/login` after auth state hydrates.
- **`AdminGate`** (`features/auth/components/AdminGate.tsx`): used in `app/admin/layout.tsx` for all `/admin/*` routes. Redirects unauthenticated users to `/login` and non-admins to `/`.
- Prefer layout-level gates over duplicating `useEffect` redirect logic in every page.
- **Server Components:** static or read-mostly content (marketing copy, metadata) can stay in server components. Pages that use hooks, browser storage, cart/auth context, or event handlers should remain client components (`'use client'`) or split into a thin server page that renders a client feature component. Do not fetch authenticated data in Server Components until a cookie-based or server-side session strategy exists; the app currently stores JWTs in `localStorage`.

## Example: composing the catalog

The home route should remain the URL entry point. The catalog feature assembles the page from meaningful parts:

```text
app/page.tsx
  -> CatalogPage
       -> SiteHeader              # shared layout
       -> CatalogToolbar          # search and category filter
       -> ProductGrid
            -> ProductCard        # one product and its actions
       -> CatalogPagination
```

`CatalogPage` owns catalog loading and filter state, or delegates that state to a feature hook if it becomes substantial. `ProductCard` receives a product and callbacks as props; it does not independently fetch products. The same `ProductCard` can later be reused in other catalog views without making it responsible for cart persistence or routing.

Apply the same approach to admin pages: the route composes an admin feature page, and that feature page can be split into a toolbar, table/list, and focused create/edit form when those pieces improve reuse or readability.

## State and API boundaries

- Keep **authentication state** in the auth provider and expose it through the existing auth hook.
- Keep **cart state** and derived totals in the cart provider; feature components use the cart hook rather than duplicating cart calculations.
- Keep **temporary UI state** (filters, open dialogs, form fields) inside the page or feature that owns it.
- Keep **server data** loaded through typed feature API functions. Components should receive data and callbacks rather than constructing URLs or fetch options.
- Keep **API base URL and transport behavior** centralized. The browser-visible URL belongs in `NEXT_PUBLIC_API_URL`; never put database or Cloudinary secrets in frontend configuration.
- Treat the Express API as the source of truth for authorization, validation, inventory, pricing, and order status. Frontend checks improve UX but do not replace backend checks.

The API currently groups endpoints in `routes/auth.route.js`, `routes/product.route.js`, `routes/category.route.js`, `routes/order.route.js`, and `routes/admin.user.route.js`. Keep those backend concerns separate from the frontend component tree; connect them through the HTTP API rather than importing backend models or route code into the frontend.

## Incremental refactoring order

0. ~~Resolve the **Priority 0 security and behavior fixes** above~~ **Done.** Continue verifying the request/response contract inventory.

1. ~~**Extract the shared site shell** from the home page into layout components~~ **Done** — `SiteHeader`.
2. ~~**Refactor the catalog** into a feature page, toolbar, product grid, and product card~~ **Done.**
3. **Group API functions and types by feature** as each page is refactored. API modules exist; move remaining page logic next. Keep the shared API client in one place and make its types match the established contracts.
4. **Refactor checkout and orders**, then profile and authentication, without changing routes or contracts except for explicitly agreed corrections.
5. **Refactor admin pages** into their respective product, category, order, and user features. Share UI only where the same behavior genuinely exists.
6. After each feature, run the existing lint/build commands and manually verify its primary user flow before moving on.

## Completion criteria

- Route files are small and primarily compose route and feature UI.
- Feature logic stays with the feature that owns it; generic UI stays domain-independent.
- API calls and types are explicit and typed, with one shared HTTP transport.
- Shared authentication and cart state have one owner.
- Existing routes and verified API contracts remain compatible during the refactor; intentional contract corrections are updated on both sides and covered by regression tests.
