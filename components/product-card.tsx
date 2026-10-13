"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CakeSlice, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency, getCategoryName } from "@/lib/utils";
import { Button } from "./ui/button";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const image = product.images?.[0];
  const inStock = product.countInStock > 0;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    addToCart(product);
    setAdded(true);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none">
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        aria-label={`View ${product.title}`}
      >
        {image ? (
          <Image
            src={image}
            alt={product.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
          />
        ) : (
          <div aria-hidden="true" className="flex h-full items-center justify-center text-rose-300">
            <CakeSlice className="size-14" strokeWidth={1.25} />
          </div>
        )}
        {!inStock && (
          <span className="absolute left-3 top-3 rounded-full bg-stone-900/85 px-3 py-1 text-xs font-semibold text-white">
            Sold out
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-800">
          {getCategoryName(product.category)}
        </p>
        <Link
          href={`/products/${product.id}`}
          className="mt-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <h2 className="line-clamp-1 font-[var(--font-heading)] text-xl font-semibold">
            {product.title}
          </h2>
        </Link>
        {product.description && (
          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-bold">{formatCurrency(product.price)}</p>
            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <Star aria-hidden="true" className="size-4 fill-amber-400 text-amber-500" />
              {product.rating.average.toFixed(1)}
              <span className="sr-only">out of 5,</span>
              <span>({product.rating.count})</span>
            </span>
          </div>
          <p className={`mt-1 text-sm ${inStock ? "text-muted-foreground" : "font-medium text-destructive"}`}>
            {inStock ? `${product.countInStock} available` : "Currently unavailable"}
          </p>
          <Button
            type="button"
            className="mt-4 min-h-11 w-full rounded-full"
            onClick={handleAddToCart}
            disabled={!inStock}
            aria-label={`Add ${product.title} to cart`}
          >
            {added ? "Added to cart" : "Add to cart"}
          </Button>
          <span className="sr-only" role="status" aria-live="polite">
            {added ? `${product.title} added to cart` : ""}
          </span>
        </div>
      </div>
    </article>
  );
}
