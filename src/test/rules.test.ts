import { describe, expect, it } from "vitest";
import {
  filterPropertiesByLocation,
  previewDescription,
  PROPERTIES,
  propertyAddress,
  normalizeDescription,
} from "@/lib/properties";
import { canViewFullDetails, isValidIndianMobile } from "@/lib/verification";

describe("location search", () => {
  it("returns only properties in the typed location", () => {
    const results = filterPropertiesByLocation("budigere cross");
    expect(results.map((p) => p.id)).toEqual(["RPL-1001"]);
  });

  it.each(["Budigere Cross", "Seegehalli", "Katmanllur", "Mandur"])("searches mapped location %s case-insensitively", (location) => {
    expect(filterPropertiesByLocation(` ${location.toUpperCase()} `).map((p) => p.id)).toEqual(["RPL-1001"]);
  });

  it("does not search the replaced sample location", () => {
    expect(filterPropertiesByLocation("koramangala")).toHaveLength(0);
  });

  it("returns nothing when no property matches the location", () => {
    expect(filterPropertiesByLocation("Mysore")).toHaveLength(0);
  });

  it("lists 4 properties when nothing is typed", () => {
    expect(filterPropertiesByLocation("")).toHaveLength(4);
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
    expect(p.images).toHaveLength(6);
    expect(p.images[0]).toContain("complex");
    expect(p.images.at(-1)).toContain("compass");
  });
});
