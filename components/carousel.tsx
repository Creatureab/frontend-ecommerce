"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "./ui/button";

interface Props {
  products: Product[];
}

export function Carousel({ products }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeIndex = Math.min(currentIndex, Math.max(products.length - 1, 0));
  const currentProduct = products[activeIndex] ?? products[0];

  if (!currentProduct) {
    return null;
  }

  const showPrevious = () => {
    setCurrentIndex((index) => (index - 1 + products.length) % products.length);
  };
  const showNext = () => {
    setCurrentIndex((index) => (index + 1) % products.length);
  };

  return (
    <section
      aria-label="Featured cakes"
      aria-roledescription="carousel"
      className="relative isolate min-h-80 overflow-hidden rounded-3xl bg-rose-950 text-white sm:min-h-96"
    >
      {currentProduct.images[0] ? (
        <Image
          key={currentProduct.images[0]}
          src={currentProduct.images[0]}
          alt=""
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover"
        />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-rose-900 to-amber-900" />
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/55 to-stone-950/10" />

      <div
        key={currentProduct.id}
        role="group"
        aria-roledescription="slide"
        aria-label={`${activeIndex + 1} of ${products.length}`}
        aria-live="off"
        className="relative flex min-h-80 max-w-2xl flex-col justify-center p-6 sm:min-h-96 sm:p-10 lg:p-14"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-200">
          Fresh from our ovens
        </p>
        <h2 className="mt-3 font-[var(--font-heading)] text-3xl font-semibold leading-tight sm:text-5xl">
          {currentProduct.title}
        </h2>
        {currentProduct.description && (
          <p className="mt-4 line-clamp-2 max-w-xl text-sm leading-6 text-white/85 sm:text-base">
            {currentProduct.description}
          </p>
        )}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="text-xl font-semibold">{formatCurrency(currentProduct.price)}</span>
          <Button
            asChild
            className="min-h-11 rounded-full bg-white px-6 text-rose-950 hover:bg-rose-50"
          >
            <Link href={`/products/${currentProduct.id}`}>Explore this cake</Link>
          </Button>
        </div>
      </div>

      {products.length > 1 && (
        <div className="absolute bottom-4 right-4 z-10 flex gap-2 sm:bottom-6 sm:right-6">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="size-11 rounded-full"
            aria-label="Show previous featured cake"
            onClick={showPrevious}
          >
            <ArrowLeft aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="size-11 rounded-full"
            aria-label="Show next featured cake"
            onClick={showNext}
          >
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      )}
    </section>
  );
}
