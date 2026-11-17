import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  BedDouble,
  CalendarDays,
  Check,
  IndianRupee,
  Lock,
  MapPin,
  Ruler,
  Sofa,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { formatRupees, getPropertyById, previewDescription, propertyAddress } from "@/lib/properties";
import { loadVerifiedVisitor, saveVerifiedVisitor, type VerifiedVisitor } from "@/lib/verification";
import { CONTACT_DISPLAY, CONTACT_TEL } from "@/lib/contact";

export const Route = createFileRoute("/property/$id")({
  loader: ({ params }) => {
    const property = getPropertyById(params.id);
    if (!property) throw notFound();
    return { property };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.property;
    const title = p ? `${p.id} – Rent in Bangalore | REPLAD` : "Property | REPLAD";
    const description = p
      ? `${previewDescription(p.description)} View photos of ${p.id} on REPLAD Tenant Search.`
      : "Rental property in Bangalore on REPLAD Tenant Search.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Property not found</h1>
        <p className="mt-2 text-muted-foreground">This listing may have been rented out.</p>
        <Link to="/" search={{}} className="mt-6 inline-block font-semibold text-primary underline">
          Back to all properties
        </Link>
      </div>
    </div>
  ),
  component: PropertyPage,
});

function PropertyPage() {
  const { property } = Route.useLoaderData();
  const [active, setActive] = useState(0);
  const [visitor, setVisitor] = useState<VerifiedVisitor | null>(null);

  useEffect(() => {
    setVisitor(loadVerifiedVisitor());
  }, []);

  useEffect(() => setActive(0), [property.id]);

  const unlocked = visitor !== null;

  // OTP verification is temporarily removed: Read more unlocks the full details directly.
  function handleReadMore() {
    const v: VerifiedVisitor = { mobile: "", email: "" };
    saveVerifiedVisitor(v);
    setVisitor(v);
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link
          to="/"
          search={{}}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" /> Back to properties
        </Link>

        <div className="mt-5 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* Gallery */}
          <div>
            <div className="overflow-hidden rounded-2xl bg-muted shadow-card">
              <img
                src={property.images[active]}
                alt={`${property.id} – photo ${active + 1}`}
                width={1280}
                height={896}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {property.images.map((src, i) => (
                <Button
                  variant="ghost"
                  key={src}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show photo ${i + 1}`}
                  className={`h-auto p-0 overflow-hidden rounded-xl ring-offset-2 ring-offset-background transition ${
                    i === active ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    width={1280}
                    height={896}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </Button>
              ))}
            </div>

            {unlocked && (
              <div className="mt-6 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <Fact icon={<IndianRupee />} label="Monthly rent" value={formatRupees(property.rent)} />
                  <Fact icon={<Wallet />} label="Security Deposit" value={formatRupees(property.deposit)} />
                  <Fact icon={<BedDouble />} label="Type" value={property.bhk} />
                  <Fact icon={<Ruler />} label="Super Built-up area" value={`${property.areaSqft} sq.ft`} />
                  <Fact icon={<Sofa />} label="Furnishing" value={property.furnishing} />
                  <Fact icon={<CalendarDays />} label="Available" value={property.availableFrom} />
                  <div className="col-span-2">
                    <Fact icon={<Users />} label="Preferred tenants" value={property.preferredTenants} />
                  </div>
                </div>

                <div className="rounded-2xl bg-card p-6 shadow-card">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                    Amenities
                  </h2>
                  <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    {property.amenities.map((a) => (
                      <li key={a} className="flex items-center gap-2">
                        <Check className="size-4 text-success" /> {a}
                      </li>
                    ))}
                  </ul>
                </div>

                {property.mapLink && (
                  <div className="border-t border-border pt-5">
                    <Button asChild variant="outline" className="h-auto whitespace-normal py-3">
                      <a href={property.mapLink} target="_blank" rel="noopener noreferrer">
                        <MapPin className="size-4" /> Open in Google Maps
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-5 self-start lg:sticky lg:top-6">
            <div className="rounded-2xl bg-card p-6 shadow-card">
              <span className="rounded-md bg-highlight px-2.5 py-1 font-display text-sm font-bold text-highlight-foreground">
                {property.bhk || property.id}
              </span>
              {unlocked && (
                <h1 className="mt-4 text-3xl font-extrabold">
                  {property.title || property.id}
                  <span className="mt-1 flex items-center gap-1.5 text-[14pt] font-bold text-foreground">
                    <MapPin className="size-4 text-primary" />{" "}
                    {propertyAddress(property)}
                  </span>
                </h1>
              )}
              {!unlocked && <h1 className="sr-only">{property.id}</h1>}

              <h2 className="mt-5 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Description
              </h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed">
                {unlocked ? property.description : previewDescription(property.description)}
                {!unlocked && (
                  <>
                    {" "}
                    <Button
                      variant="link"
                      type="button"
                      onClick={handleReadMore}
                      className="h-auto p-0 font-semibold text-primary underline underline-offset-4 hover:text-primary-deep"
                    >
                      Read more
                    </Button>
                  </>
                )}
              </p>

              {!unlocked && (
                <div className="mt-5 flex items-start gap-3 rounded-xl bg-secondary p-4 text-sm text-secondary-foreground">
                  <Lock className="mt-0.5 size-4 shrink-0" />
                  Read more to see rent, deposit, size, amenities and the full description.
                </div>
              )}

              {unlocked && visitor.email && (
                <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-success">
                  <BadgeCheck className="size-4" /> Verified as {visitor.email}
                </p>
              )}
            </div>

            {unlocked && (
              <>
                <div className="flex items-start gap-3 rounded-2xl border border-dashed border-primary/40 bg-accent p-5 text-sm text-accent-foreground">
                  <Lock className="mt-0.5 size-4 shrink-0" />
                  <p>
                    <strong>Complete address is not shown online.</strong> Call REPLAD on{" "}
                    <a href={CONTACT_TEL} className="font-semibold underline">
                      {CONTACT_DISPLAY}
                    </a>{" "}
                    to arrange a visit.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-card [&_svg]:size-5 [&_svg]:text-primary">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="break-words font-semibold">{value}</p>
      </div>
    </div>
  );
}
