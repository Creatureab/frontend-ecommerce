"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CakeSlice, Minus, Plus, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency, getCategoryName } from "@/lib/utils";
import { Button } from "./ui/button";

interface Props {
  product: Product;
}

export function ProductDetail({ product }: Props) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addedQuantity, setAddedQuantity] = useState<number | null>(null);
  const images = product.images?.filter(Boolean) ?? [];
  const currentImage = images[currentImageIndex];
  const inStock = product.countInStock > 0;

  const addProductToCart = (goToCheckout = false) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    addToCart(product, quantity);
    setAddedQuantity(quantity);
    if (goToCheckout) {
      router.push("/checkout");
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to cakes
      </Link>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-rose-50">
            {currentImage ? (
              <Image
                src={currentImage}
                alt={product.title}
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div aria-hidden="true" className="flex h-full items-center justify-center text-rose-300">
                <CakeSlice className="size-24" strokeWidth={1.25} />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <ul aria-label="Product images" className="mt-3 flex flex-wrap gap-3 p-0">
              {images.map((image, index) => (
                <li key={`${image}-${index}`}>
                  <button
                    type="button"
                    aria-label={`Show image ${index + 1} of ${product.title}`}
                    aria-pressed={currentImageIndex === index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative size-16 overflow-hidden rounded-xl border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:size-20 ${
                      currentImageIndex === index ? "border-rose-800" : "border-border hover:border-rose-300"
                    }`}
                  >
                    <Image
                      src={image}
                      alt=""
                      fill
                      unoptimized
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <section aria-labelledby="product-title" className="flex flex-col py-1">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rose-800">
            {getCategoryName(product.category)}
          </p>
          <h1
            id="product-title"
            className="mt-2 font-[var(--font-heading)] text-3xl font-semibold leading-tight text-foreground sm:text-4xl"
          >
            {product.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-2xl font-bold">{formatCurrency(product.price)}</p>
            <span
              className={`text-sm font-medium ${
                inStock ? "text-emerald-800" : "text-destructive"
              }`}
            >
              {inStock ? `${product.countInStock} available` : "Currently unavailable"}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Star aria-hidden="true" className="size-4 fill-amber-400 text-amber-500" />
              <span className="font-semibold text-foreground">
                {product.rating.average.toFixed(1)}
              </span>
            </span>
            <span>({product.rating.count} reviews)</span>
          </div>

          <div className="mt-6 border-t border-border pt-6">
            <h2 className="font-semibold">About this cake</h2>
            <p className="mt-2 whitespace-pre-line leading-7 text-muted-foreground">
              {product.description || "Freshly prepared for your celebrations."}
            </p>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-sm font-medium">Quantity</p>
            <div className="inline-flex items-center gap-2 rounded-full border border-border p-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-11 rounded-full"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                disabled={quantity <= 1}
              >
                <Minus aria-hidden="true" />
              </Button>
              <output aria-live="polite" className="min-w-8 text-center font-semibold">
                {quantity}
              </output>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-11 rounded-full"
                aria-label="Increase quantity"
                onClick={() => setQuantity((value) => Math.min(product.countInStock, value + 1))}
                disabled={!inStock || quantity >= product.countInStock}
              >
                <Plus aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              size="lg"
              className="min-h-12 rounded-full"
              onClick={() => addProductToCart()}
              disabled={!inStock}
            >
              {inStock ? "Add to cart" : "Out of stock"}
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="min-h-12 rounded-full"
              onClick={() => addProductToCart(true)}
              disabled={!inStock}
            >
              Buy now
            </Button>
          </div>
          <p className="mt-3 min-h-5 text-sm text-emerald-800" role="status" aria-live="polite">
            {addedQuantity !== null
              ? `${addedQuantity} ${addedQuantity === 1 ? "cake" : "cakes"} added to your cart.`
              : ""}
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            {product.views} views · Added {new Date(product.createdAt).toLocaleDateString()}
          </p>
        </section>
      </div>
    </main>
  );
}
