import { describe, expect, it } from "vitest";
import {
  filterPropertiesByLocation,
  previewDescription,
  PROPERTIES,
  propertyAddress,
  normalizeDescription,
  propertiesFromRows,
  resolvePropertyImages,
} from "@/lib/properties";
import { canViewFullDetails, isValidIndianMobile } from "@/lib/verification";

describe("location search", () => {
  it("returns only properties in the typed location", () => {
    const results = filterPropertiesByLocation("budigere cross");
    expect(results.map((p) => p.id)).toEqual(["RPL-1001", "RPL-1002"]);
  });

  it.each(["Budigere Cross", "Seegehalli", "Katmanllur", "Mandur"])("searches mapped location %s case-insensitively", (location) => {
    expect(filterPropertiesByLocation(` ${location.toUpperCase()} `).map((p) => p.id)).toEqual(["RPL-1001", "RPL-1002"]);
  });

  it("does not search the replaced sample location", () => {
    expect(filterPropertiesByLocation("koramangala")).toHaveLength(0);
  });

  it("returns nothing when no property matches the location", () => {
    expect(filterPropertiesByLocation("Mysore")).toHaveLength(0);
  });

  it("lists only the two properties in the supplied sheet", () => {
    expect(filterPropertiesByLocation("").map((p) => p.id)).toEqual(["RPL-1001", "RPL-1002"]);
  });
});

describe("property description preview", () => {
  it("shows only the first 100 characters before Read more", () => {
    const text = PROPERTIES[0]?.description ?? "";
    expect(text.length).toBeGreaterThan(100);
    expect(previewDescription(text).replace("…", "").length).toBeLessThanOrEqual(100);
  });
  it("turns literal newline markers into line breaks", () => {
    expect(normalizeDescription("First\\nSecond\nThird\\r\\nFourth")).toBe("First\nSecond\nThird\nFourth");
    expect(PROPERTIES[0]?.description).not.toContain("\\n");
  });
});

describe("verification", () => {
  it("unlocks details only when both mobile and email are verified", () => {
    expect(canViewFullDetails({ mobileVerified: true, emailVerified: false })).toBe(false);
    expect(canViewFullDetails({ mobileVerified: false, emailVerified: true })).toBe(false);
    expect(canViewFullDetails({ mobileVerified: true, emailVerified: true })).toBe(true);
  });

  it("accepts 7026400502 as a valid mobile and rejects short numbers", () => {
    expect(isValidIndianMobile("7026400502")).toBe(true);
    expect(isValidIndianMobile("12345")).toBe(false);
  });
});

describe("address and map link from the spreadsheet", () => {
  const p = PROPERTIES.find((x) => x.id === "RPL-1001");
  it("shows the Address column value exactly as written in the sheet", () => {
    if (!p) throw new Error("RPL-1001 missing");
    expect(p.address).toBe("Shriram WYTField, Budigere Cross");
    expect(propertyAddress(p)).toBe("Shriram WYTField, Budigere Cross");
  });
  it("carries the Location Map link from the sheet", () => {
    expect(p?.mapLink).toBe("https://maps.app.goo.gl/De7HD29hbv7Q7uBG7");
  });
});

describe("spreadsheet data for RPL-1001", () => {
  const p = PROPERTIES.find((x) => x.id === "RPL-1001");
  it("uses rent and amenities from property_details.xlsx", () => {
    if (!p) throw new Error("RPL-1001 missing");
    expect(p.rent).toBe(29000);
    expect(p.amenities).toContain("Senior Citizen Sit-Outs");
    expect(p.amenities).toHaveLength(12);
  });
  it("puts the main image first and the compass photo last", () => {
    if (!p) throw new Error("RPL-1001 missing");
    expect(p.images).toHaveLength(7);
    expect(p.images[0]).toContain("exterior");
    expect(p.images.at(-1)).toContain("compass");
  });
});

describe("spreadsheet-only listing rules", () => {
  it("includes Active rows and excludes inactive, missing and other statuses", () => {
    const rows = propertiesFromRows([
      { id: "RPL-2001", "listing status": "Active" },
      { id: "RPL-2002", "listing status": " inactive " },
      { id: "RPL-2003" },
      { id: "RPL-2004", "listing status": "Draft" },
      { id: "RPL-2005", "listing status": " ACTIVE " },
    ]);
    expect(rows.map((p) => p.id)).toEqual(["RPL-2001", "RPL-2005"]);
    expect(propertiesFromRows([])).toEqual([]);
  });

  it("uses exact sheet attributes including descriptions without sample or text-file fallback", () => {
    const row = propertiesFromRows([{ id: "RPL-1001", "listing status": "Active", rent: 43210, areaSqft: 975, description: "Sheet\\nDescription", keywords: "Alpha, Beta", Address: "Exact address" }])[0];
    expect(row?.rent).toBe(43210);
    expect(row?.areaSqft).toBe(975);
    expect(row?.description).toBe("Sheet\nDescription");
    expect(row?.keywords).toEqual(["Alpha", "Beta"]);
    expect(row?.address).toBe("Exact address");
    expect(PROPERTIES[0]?.areaSqft).toBe(880);
    expect(PROPERTIES[0]?.bhk).toBe("9 BHK");
    expect(PROPERTIES[0]?.availableFrom).toBe("20 November 2026");
    expect(PROPERTIES[1]?.rent).toBe(38000);
  });

  it("resolves comma-separated local photos with exterior first and compass last", () => {
    const files = {
      "/src/assets/rpl-2001/property-2001-living.jpg": "living.jpg",
      "/src/assets/rpl-2001/property-2001-exterior.jpg": "exterior.jpg",
      "/src/assets/rpl-2001/property-2001-compass.jpg": "compass.jpg",
    };
    expect(resolvePropertyImages("RPL-2001", "image-2001-compass.jpg, image-2001-living.jpg, image-2001-exterior.jpg, missing.jpg", files)).toEqual(["exterior.jpg", "living.jpg", "compass.jpg"]);
    expect(PROPERTIES[1]?.images).toHaveLength(2);
  });
});
