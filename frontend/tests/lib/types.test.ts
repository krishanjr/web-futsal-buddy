import { FUTSAL_FACILITIES } from "@/lib/types";

describe("FUTSAL_FACILITIES", () => {
  it("contains the expected list of facilities", () => {
    expect(FUTSAL_FACILITIES).toEqual([
      "Parking",
      "Cafeteria",
      "Changing Room",
      "Washroom",
      "Flood Lights",
    ]);
  });

  it("has exactly 5 entries", () => {
    expect(FUTSAL_FACILITIES).toHaveLength(5);
  });

  it("contains only unique facility names", () => {
    const unique = new Set(FUTSAL_FACILITIES);
    expect(unique.size).toBe(FUTSAL_FACILITIES.length);
  });
});
