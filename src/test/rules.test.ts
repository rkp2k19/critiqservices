import { describe, expect, it } from "vitest";
import {
  filterPropertiesByLocation,
  previewDescription,
  PROPERTIES,
} from "@/lib/properties";
import { canViewFullDetails, isValidIndianMobile } from "@/lib/verification";

describe("location search", () => {
  it("returns only properties in the typed location", () => {
    const results = filterPropertiesByLocation("koramangala");
    expect(results.map((p) => p.id)).toEqual(["RPL-1001"]);
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
    const text = PROPERTIES[0]!.description;
    expect(text.length).toBeGreaterThan(100);
    expect(previewDescription(text).replace("…", "").length).toBeLessThanOrEqual(100);
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

describe("address from the spreadsheet", () => {
  it("shows the Address column value for RPL-1001", () => {
    const p = PROPERTIES.find((x) => x.id === "RPL-1001")!;
    expect(p.address).toBe("Shriram WYTField");
  });
});

describe("spreadsheet data for RPL-1001", () => {
  const p = PROPERTIES.find((x) => x.id === "RPL-1001")!;
  it("uses rent and amenities from property_details.xlsx", () => {
    expect(p.rent).toBe(29000);
    expect(p.amenities).toContain("Senior Citizen Sit-Outs");
    expect(p.amenities).toHaveLength(12);
  });
  it("puts the main image first and the compass photo last", () => {
    expect(p.images).toHaveLength(6);
    expect(p.images[0]).toContain("complex");
    expect(p.images.at(-1)).toContain("compass");
  });
});
