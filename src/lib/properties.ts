import p1001aAsset from "@/assets/property-1001-exterior.jpg.asset.json";
import p1001b from "@/assets/property-1001-living.jpg";
import p1002a from "@/assets/property-1002-exterior.jpg";
import p1002b from "@/assets/property-1002-living.jpg";
import p1003a from "@/assets/property-1003-living.jpg";
import p1003b from "@/assets/property-1003-kitchen.jpg";
import p1004a from "@/assets/property-1004-exterior.jpg";
import p1004b from "@/assets/property-1004-bedroom.jpg";

export type Property = {
  id: string;
  title: string;
  /** Locality only. The complete address is never shipped to the browser. */
  locality: string;
  city: string;
  /** Extra place names a tenant might type for this listing. */
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

export const PROPERTIES: Property[] = [
  {
    id: "RPL-1001",
    title: "2 BHK Apartment",
    locality: "Koramangala",
    city: "Bangalore",
    keywords: ["koramangala", "5th block", "sony signal", "forum"],
    images: [p1001a, p1001b],
    description:
      "Bright, well-ventilated 2 BHK on the 3rd floor of a boutique gated building in the heart of Koramangala. East-facing balconies with greenery, Italian marble flooring, modular kitchen with chimney and hob, and two attached bathrooms. Walking distance to cafés, supermarkets and the Forum area. Covered car parking, 24x7 security and power backup for common areas.",
    rent: 32000,
    deposit: 150000,
    bhk: "2 BHK",
    areaSqft: 1150,
    furnishing: "Semi-furnished",
    availableFrom: "Immediate",
    preferredTenants: "Family / Working professionals",
    amenities: ["Covered parking", "Lift", "Power backup", "24x7 security", "Gas pipeline"],
  },
  {
    id: "RPL-1002",
    title: "3 BHK Independent Villa",
    locality: "Whitefield",
    city: "Bangalore",
    keywords: ["whitefield", "itpl", "varthur", "hope farm"],
    images: [p1002a, p1002b],
    description:
      "Spacious 3 BHK duplex villa with a private front garden in a quiet Whitefield community. Double-height living room, separate dining, large kitchen with utility, and a terrace sit-out. All bedrooms have wardrobes and attached baths. Close to ITPL, international schools and the metro. Ideal for families who want space and calm within reach of the tech corridor.",
    rent: 55000,
    deposit: 300000,
    bhk: "3 BHK",
    areaSqft: 2400,
    furnishing: "Semi-furnished",
    availableFrom: "1st of next month",
    preferredTenants: "Family",
    amenities: ["Private garden", "2 car parks", "Clubhouse", "Borewell + Cauvery water", "CCTV"],
  },
  {
    id: "RPL-1003",
    title: "1 BHK Furnished Flat",
    locality: "Indiranagar",
    city: "Bangalore",
    keywords: ["indiranagar", "100 feet road", "cmh road", "hal"],
    images: [p1003a, p1003b],
    description:
      "Cosy fully furnished 1 BHK on a tree-lined lane off 100 Feet Road, Indiranagar. Comes with sofa, queen bed, wardrobe, TV, fridge, washing machine and a fitted kitchen. Large windows bring in lots of natural light. Just minutes from the metro station, restaurants and shopping on CMH Road. Perfect for a working professional or a young couple.",
    rent: 22000,
    deposit: 100000,
    bhk: "1 BHK",
    areaSqft: 620,
    furnishing: "Fully furnished",
    availableFrom: "Immediate",
    preferredTenants: "Working professionals / Couples",
    amenities: ["Fully furnished", "Near metro", "Two-wheeler parking", "Power backup"],
  },
  {
    id: "RPL-1004",
    title: "2 BHK in Gated Community",
    locality: "HSR Layout",
    city: "Bangalore",
    keywords: ["hsr layout", "hsr", "sector 2", "agara", "silk board"],
    images: [p1004a, p1004b],
    description:
      "Modern 2 BHK in a premium gated community in HSR Layout with swimming pool, gym and children's play area. High-floor unit with open city views, vitrified flooring, wardrobes in both bedrooms and a large balcony. Easy access to Outer Ring Road, Silk Board and Agara Lake. Round-the-clock security and dedicated maintenance staff.",
    rent: 28000,
    deposit: 140000,
    bhk: "2 BHK",
    areaSqft: 1080,
    furnishing: "Semi-furnished",
    availableFrom: "15 days",
    preferredTenants: "Family / Working professionals",
    amenities: ["Swimming pool", "Gym", "Kids play area", "Covered parking", "24x7 security"],
  },
];

/** Locations shown as quick-pick chips under the search bar. */
export const POPULAR_LOCATIONS = PROPERTIES.map((p) => p.locality);

/** Returns every property whose location matches the typed text. Empty text returns all. */
export function filterPropertiesByLocation(query: string, list: Property[] = PROPERTIES) {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter((p) =>
    [p.locality, p.city, ...p.keywords].some((place) => place.toLowerCase().includes(q)),
  );
}

export function getPropertyById(id: string) {
  return PROPERTIES.find((p) => p.id.toLowerCase() === id.toLowerCase());
}

export const PREVIEW_LENGTH = 100;

/** Shows only the first 100 characters of a description before "Read more". */
export function previewDescription(text: string, length = PREVIEW_LENGTH) {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trimEnd()}…`;
}

export function formatRupees(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}
