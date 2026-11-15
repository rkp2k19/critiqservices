import { Link } from "@tanstack/react-router";
import type { Property } from "@/lib/properties";

export function PropertyCard({ property, index }: { property: Property; index: number }) {
  return (
    <Link
      to="/property/$id"
      params={{ id: property.id }}
      className="group block overflow-hidden rounded-2xl bg-card shadow-card transition-all hover:-translate-y-1 animate-rise focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[0]}
          alt={`Property ${property.id}`}
          width={1280}
          height={896}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Property ID
        </span>
        <span className="rounded-md bg-highlight px-2 py-0.5 font-display text-sm font-bold text-highlight-foreground">
          {property.id}
        </span>
      </div>
    </Link>
  );
}
