import sheets from "@/assets/property_details.xlsx";

type Row = Record<string, unknown>;
const amenityNames = new Map(
  (sheets["Amenities"] ?? []).map((r: Row) => [String(r["SI No"]).trim(), String(r["Amenities"]).trim()]),
);
const imageFiles = import.meta.glob("/src/assets/*/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", {
  query: "?url",
  import: "default",
  eager: true,
}) as Record<string, string>;

export type Property = {
  id: string;
  title: string;
  locality: string;
  address?: string | undefined;
  mapLink?: string | undefined;
  city: string;
  keywords: string[];
  images: string[];
  description: string;
  rent: number;
  deposit: number;
  bhk: string;
  areaSqft: number;
  furnishing: string;
  availableFrom: string;
  preferredTenants: string;
  amenities: string[];
};

export function splitCommaSeparated(cell: unknown) {
  return String(cell ?? "").split(",").map((part) => part.trim()).filter(Boolean);
}

export function mapAmenities(cell: unknown, names: Map<string, string> = amenityNames) {
  return String(cell ?? "").split(/[,;]/).map((n) => names.get(n.trim())).filter((n): n is string => Boolean(n));
}

export function normalizeDescription(text: string) {
  return text.replace(/\\r\\n|\\n/g, "\n");
}

export function propertyAddress(p: Property) {
  return p.address ?? "";
}

function formatAvailable(v: unknown) {
  if (!v) return "";
  const d = v instanceof Date ? v : new Date(String(v));
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

/** Resolve only local files named in the sheet; legacy image- names match property- files. */
export function resolvePropertyImages(id: string, cell: unknown, files = imageFiles) {
  const folder = `/src/assets/${id.toLowerCase()}/`;
  const rank = (name: string) => /compass/i.test(name) ? 2 : /exterior/i.test(name) ? 0 : 1;
  const names = splitCommaSeparated(cell).sort((a, b) => rank(a) - rank(b));
  return [...new Set(names.flatMap((name) => {
    const filename = name.split("/").at(-1) ?? name;
    const candidates = [filename, filename.replace(/^image-/i, "property-")];
    const match = Object.entries(files).find(([path]) =>
      path.toLowerCase().startsWith(folder) && candidates.some((candidate) => path.split("/").at(-1)?.toLowerCase() === candidate.toLowerCase()),
    );
    return match ? [match[1]] : [];
  }))];
}

/** The spreadsheet is the sole source of property rows and display attributes. */
export function propertiesFromRows(rows: Row[], files = imageFiles): Property[] {
  return rows.filter((row) => String(row["listing status"] ?? "").trim().toLowerCase() === "active")
    .filter((row) => String(row.id ?? "").trim())
    .map((row) => {
      const id = String(row.id).trim();
      const text = (key: string) => String(row[key] ?? "");
      const num = (key: string) => Number.isFinite(Number(row[key])) ? Number(row[key]) : 0;
      return {
        id,
        title: text("title"),
        address: text("Address"),
        locality: text("locality"),
        city: text("city"),
        rent: num("rent"),
        deposit: num("deposit"),
        bhk: text("bhk"),
        areaSqft: num("areaSqft"),
        furnishing: text("furnishing"),
        availableFrom: formatAvailable(row.availableFrom),
        preferredTenants: text("preferredTenants"),
        amenities: mapAmenities(row.amenities),
        mapLink: text("Location Map link"),
        keywords: splitCommaSeparated(row.keywords),
        description: normalizeDescription(text("description")),
        images: resolvePropertyImages(id, row.images, files),
      };
    });
}

const propertyRows = Object.entries(sheets).filter(([name]) => name !== "Amenities").flatMap(([, rows]) => rows);
export const PROPERTIES = propertiesFromRows(propertyRows);
export const POPULAR_LOCATIONS = [...new Set(PROPERTIES.flatMap((p) => p.keywords))];

export function filterPropertiesByLocation(query: string, list: Property[] = PROPERTIES) {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter((p) => p.keywords.some((place) => place.toLowerCase().includes(q)));
}

export function getPropertyById(id: string) {
  return PROPERTIES.find((p) => p.id.toLowerCase() === id.toLowerCase());
}

export const PREVIEW_LENGTH = 100;
export function previewDescription(text: string, length = PREVIEW_LENGTH) {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trimEnd()}…`;
}

export function formatRupees(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}
