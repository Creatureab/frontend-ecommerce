import type { Metadata } from "next";
import Link from "next/link";
import { CakeSlice } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Cake Point",
  description:
    "Meet Cake Point, your neighborhood bakery for fresh cakes and custom-baked creations in Kolhapur.",
};

const offerings = [
  {
    title: "Custom designer cakes",
    description:
      "Personalized cakes for birthdays, anniversaries, weddings, and corporate celebrations, made to match your theme and vision.",
  },
  {
    title: "Classic & trendy flavours",
    description:
      "Choose timeless favourites like chocolate, red velvet, and butterscotch, or discover fresh fruit and fusion cakes.",
  },
  {
    title: "Freshness in every bite",
    description:
      "We bake fresh with high-grade ingredients for the taste, texture, and quality you deserve.",
  },
];

const reasons = [
  {
    title: "Quality you can trust",
    description:
      "We follow careful hygiene and quality standards to make every treat a delight.",
  },
  {
    title: "Made for your moments",
    description:
      "Your happiness matters to us. We go the extra mile to make every celebration memorable.",
  },
  {
    title: "Right here in Kolhapur",
    description:
      "Find us near Lishan on Kadamwadi Road, conveniently located for your next celebration.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fffaf5] text-stone-900">
      <section className="relative overflow-hidden border-b border-rose-100 bg-gradient-to-br from-rose-50 via-[#fffaf5] to-orange-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-8 lg:py-24">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-rose-800">
              Baked with love in Kolhapur
            </p>
            <h1 className="max-w-2xl font-[var(--font-heading)] text-4xl font-semibold leading-tight text-rose-950 sm:text-5xl lg:text-6xl">
              About Cake Point
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">
              Welcome to Cake Point, your ultimate destination for freshly
              baked happiness in Kolhapur. Every celebration—big or small—deserves
              a centerpiece that is as delightful to look at as it is delicious
              to eat.
            </p>
            <p className="mt-4 max-w-2xl leading-7 text-stone-600">
              From our convenient spot on Kadamwadi Road, we bring the
              neighbourhood premium cakes, pastries, and custom-baked
              creations made for sharing.
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-rose-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-700 focus-visible:ring-offset-2"
            >
              Find your favourite cake
            </Link>
          </div>
          <div
            aria-hidden="true"
            className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center rounded-[2rem] border border-rose-100 bg-white p-6 shadow-xl shadow-rose-950/5"
          >
            <div className="absolute inset-4 rounded-[1.5rem] border border-dashed border-rose-200" />
            <div className="relative flex h-56 w-56 flex-col items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-orange-100 text-center shadow-inner">
              <CakeSlice aria-hidden="true" className="h-14 w-14 text-rose-800" strokeWidth={1.5} />
              <span className="mt-2 font-[var(--font-heading)] text-2xl font-semibold text-rose-950">
                A little
                <br />
                sweetness
              </span>
            </div>
            <span className="absolute left-8 top-8 h-3 w-3 rounded-full bg-amber-300" />
            <span className="absolute bottom-10 right-8 h-4 w-4 rounded-full bg-rose-300" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-800">
              Our story & passion
            </p>
            <h2 className="mt-3 font-[var(--font-heading)] text-3xl font-semibold text-rose-950 sm:text-4xl">
              A love of baking, shared with our neighbourhood.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-stone-700">
            <p>
              Cake Point began with a deep passion for the art of baking and a
              simple mission: to serve mouth-watering cakes made with the
              finest ingredients, love, and attention to detail.
            </p>
            <p>
              Over the years, we have grown into a trusted neighbourhood
              favourite for families, friends, and anyone looking to add a
              little sweetness to a special moment. For us, a cake is more than
              a dessert—it is part of the memory everyone takes home.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-rose-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-800">
              What we offer
            </p>
            <h2 className="mt-3 font-[var(--font-heading)] text-3xl font-semibold text-rose-950 sm:text-4xl">
              Something lovely for every occasion.
            </h2>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {offerings.map((offering, index) => (
              <article
                key={offering.title}
                className="rounded-2xl border border-rose-100 bg-[#fffaf5] p-6 transition-transform duration-200 hover:-translate-y-1"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-sm font-bold text-rose-900">
                  0{index + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-rose-950">
                  {offering.title}
                </h3>
                <p className="mt-3 leading-7 text-stone-600">
                  {offering.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-800">
            Why choose us?
          </p>
          <h2 className="mt-3 font-[var(--font-heading)] text-3xl font-semibold text-rose-950 sm:text-4xl">
            Your moments deserve the sweetest touch.
          </h2>
        </div>
        <div className="mt-9 grid gap-8 md:grid-cols-3">
          {reasons.map((reason) => (
            <article key={reason.title}>
              <div className="mb-4 h-1 w-12 rounded-full bg-rose-400" />
              <h3 className="text-lg font-semibold text-rose-950">
                {reason.title}
              </h3>
              <p className="mt-2 leading-7 text-stone-600">
                {reason.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-rose-950 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-200">
              Come say hello
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-3xl font-semibold">
              Let’s make your celebration sweeter.
            </h2>
            <p className="mt-3 text-rose-100">
              Visit us near Lishan on Kadamwadi Road, Kolhapur.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Cake+Point+near+Lishan+Kadamwadi+Road+Kolhapur"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-rose-200 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-rose-950"
            >
              Get directions
            </a>
            <Link
              href="/"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-rose-950 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-rose-950"
            >
              Browse cakes
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
