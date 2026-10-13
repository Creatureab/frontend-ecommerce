"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "./ui/button";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const closeMenuOnDesktop = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", closeMenuOnDesktop);
    return () => window.removeEventListener("resize", closeMenuOnDesktop);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 text-foreground shadow-sm backdrop-blur">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          className="rounded-sm font-[var(--font-heading)] text-xl font-semibold tracking-tight text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Cake Point
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <NavLink href="/">Shop</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/checkout">Checkout</NavLink>
          {isAuthenticated && <NavLink href="/profile">Profile</NavLink>}
          {isAdmin && <NavLink href="/admin">Admin</NavLink>}
          {!isAuthenticated ? (
            <>
              <NavLink href="/login">Login</NavLink>
              <Button asChild size="sm" className="ml-2">
                <Link href="/register">Create account</Link>
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-2"
              onClick={logout}
            >
              Log out
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="icon"
            aria-label={`Shopping cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
            className="relative"
          >
            <Link href="/cart">
              <ShoppingCart aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? (
              <X aria-hidden="true" />
            ) : (
              <Menu aria-hidden="true" />
            )}
          </Button>
        </div>

        <div
          id="mobile-navigation"
          hidden={!mobileOpen}
          className="absolute inset-x-0 top-full border-b border-border bg-background px-4 py-3 shadow-md md:hidden"
        >
          <ul className="mx-auto flex max-w-7xl flex-col gap-1">
            <li>
              <NavLink href="/" mobile>
                Shop
              </NavLink>
            </li>
            <li>
              <NavLink href="/about" mobile>
                About
              </NavLink>
            </li>
            <li>
              <NavLink href="/checkout" mobile>
                Checkout
              </NavLink>
            </li>
            {isAuthenticated && (
              <li>
                <NavLink href="/profile" mobile>
                  Profile
                </NavLink>
              </li>
            )}
            {isAdmin && (
              <li>
                <NavLink href="/admin" mobile>
                  Admin dashboard
                </NavLink>
              </li>
            )}
            {!isAuthenticated ? (
              <>
                <li>
                  <NavLink href="/login" mobile>
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink href="/register" mobile>
                    Create account
                  </NavLink>
                </li>
              </>
            ) : (
              <li>
                <Button
                  type="button"
                  variant="ghost"
                  className="min-h-11 w-full justify-start px-3"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                >
                  Log out
                </Button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}

function NavLink({
  href,
  children,
  mobile = false,
}: {
  href: string;
  children: ReactNode;
  mobile?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        mobile ? "w-full" : ""
      }`}
    >
      {children}
    </Link>
  );
}
