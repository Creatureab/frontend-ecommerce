import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";

interface Props {
  products: Product[];
  loading?: boolean;
}

export function ProductList({ products, loading = false }: Props) {
  if (loading) {
    return (
      <div
        role="status"
        aria-label="Loading cakes"
        aria-busy="true"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="aspect-[4/3] animate-pulse bg-muted motion-reduce:animate-none" />
            <div className="space-y-3 p-5">
              <div className="h-3 w-1/3 animate-pulse rounded bg-muted motion-reduce:animate-none" />
              <div className="h-5 w-2/3 animate-pulse rounded bg-muted motion-reduce:animate-none" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted motion-reduce:animate-none" />
            </div>
          </div>
        ))}
        <span className="sr-only">Loading cakes</span>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
        <h2 className="font-[var(--font-heading)] text-xl font-semibold">No cakes found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Try another search or choose a different category.
        </p>
      </div>
    );
  }

  return (
    <ul
      aria-label="Cakes"
      className="grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {products.map((product) => (
        <li key={product.id} className="min-w-0">
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
