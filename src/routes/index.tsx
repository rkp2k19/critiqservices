import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, Search, SearchX } from "lucide-react";
import { z } from "zod";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PropertyCard } from "@/components/site/PropertyCard";
import { Button } from "@/components/ui/button";
import { filterPropertiesByLocation, POPULAR_LOCATIONS } from "@/lib/properties";

const searchSchema = z.object({ q: z.string().max(100).optional() });

export const Route = createFileRoute("/")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "REPLAD Tenant Search – Homes for Rent in Bangalore" },
      {
        name: "description",
        content:
          "Search rental homes by location across Bangalore with REPLAD Home Services. Apartments, villas and flats verified for tenants.",
      },
      { property: "og:title", content: "REPLAD Tenant Search – Homes for Rent in Bangalore" },
      {
        property: "og:description",
        content: "Type a Bangalore location and find rental properties available right now.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { q = "" } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const [text, setText] = useState(q);

  useEffect(() => setText(q), [q]);

  const results = filterPropertiesByLocation(q);

  function runSearch(value: string) {
    const trimmed = value.trim();
    navigate({ search: trimmed ? { q: trimmed } : {}, replace: true });
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden bg-hero text-primary-foreground">
          <div className="roof-pattern absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto max-w-5xl px-4 pb-24 pt-14 text-center sm:px-6 sm:pt-20">
            <p className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-highlight">
              Tenant Search Services
            </p>
            <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] sm:text-6xl">
              Find your next rental home in <span className="text-highlight">Bangalore</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              Type a location and we’ll show every property available to rent there.
            </p>

            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                runSearch(text);
              }}
              className="mx-auto mt-10 flex max-w-3xl items-center gap-2 rounded-2xl bg-card p-2 shadow-search"
            >
              <MapPin className="ml-3 size-6 shrink-0 text-primary" aria-hidden="true" />
              <label htmlFor="location-search" className="sr-only">
                Search by location
              </label>
              <input
                id="location-search"
                type="search"
                value={text}
                maxLength={100}
                onChange={(e) => {
                  setText(e.target.value);
                  runSearch(e.target.value);
                }}
                placeholder="Enter a location, e.g. Koramangala"
                className="h-14 min-w-0 flex-1 bg-transparent px-2 text-lg text-card-foreground outline-none placeholder:text-muted-foreground sm:text-xl"
              />
              <Button type="submit" variant="hero" size="xl" className="shrink-0">
                <Search className="size-5" />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </form>

            <div className="mt-5 flex flex-wrap justify-center gap-2 text-sm">
              <span className="text-primary-foreground/70">Popular:</span>
              {POPULAR_LOCATIONS.map((place) => (
                <button
                  key={place}
                  type="button"
                  onClick={() => runSearch(place)}
                  className="rounded-full border border-primary-foreground/25 px-3 py-1 transition-colors hover:border-highlight hover:text-highlight"
                >
                  {place}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-4 sm:px-6" aria-live="polite">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-2 rounded-2xl bg-card px-5 py-4 shadow-card">
            <h2 className="text-xl font-bold sm:text-2xl">
              {q ? (
                <>
                  Properties in <span className="text-primary">“{q}”</span>
                </>
              ) : (
                "Available properties"
              )}
            </h2>
            <p className="text-sm text-muted-foreground">
              {results.length} {results.length === 1 ? "property" : "properties"} found
            </p>
          </div>

          {results.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {results.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-border bg-card px-6 py-16 text-center">
              <SearchX className="size-12 text-muted-foreground" aria-hidden="true" />
              <p className="mt-4 font-display text-2xl font-bold">No property found</p>
              <p className="mt-1 max-w-sm text-muted-foreground">
                We don’t have a rental listed in “{q}” right now. Try another location or call us.
              </p>
              <Button variant="outline" className="mt-6" onClick={() => runSearch("")}>
                Show all properties
              </Button>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
