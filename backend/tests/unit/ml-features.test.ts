import { extractFeatures } from "../../src/ml/features";

describe("ML: extractFeatures", () => {
  test("maps skill levels to the correct ordinal score", () => {
    const base = { matchesPlayed: 10, wins: 5, goals: 5, assists: 5 };
    const [beginner] = extractFeatures({ ...base, skillLevel: "beginner" });
    const [intermediate] = extractFeatures({ ...base, skillLevel: "intermediate" });
    const [advanced] = extractFeatures({ ...base, skillLevel: "advanced" });
    const [professional] = extractFeatures({ ...base, skillLevel: "professional" });

    expect(beginner).toBe(1);
    expect(intermediate).toBe(2);
    expect(advanced).toBe(3);
    expect(professional).toBe(4);
  });

  test("computes winRate, goalsPerMatch, assistsPerMatch correctly", () => {
    const [, winRate, goalsPerMatch, assistsPerMatch] = extractFeatures({
      skillLevel: "intermediate",
      matchesPlayed: 10,
      wins: 4,
      goals: 8,
      assists: 2,
    });

    expect(winRate).toBeCloseTo(0.4);
    expect(goalsPerMatch).toBeCloseTo(0.8);
    expect(assistsPerMatch).toBeCloseTo(0.2);
  });

  test("does not divide by zero when matchesPlayed is 0", () => {
    const features = extractFeatures({
      skillLevel: "beginner",
      matchesPlayed: 0,
      wins: 0,
      goals: 0,
      assists: 0,
    });

    expect(features.every((f) => Number.isFinite(f))).toBe(true);
    expect(features[1]).toBe(0); // winRate
    expect(features[2]).toBe(0); // goalsPerMatch
  });

  test("treats a negative matchesPlayed as 0 (defensive clamp)", () => {
    const features = extractFeatures({
      skillLevel: "beginner",
      matchesPlayed: -5,
      wins: 0,
      goals: 0,
      assists: 0,
    });
    expect(features.every((f) => Number.isFinite(f))).toBe(true);
  });

  test("caps the experience feature at 1.0 for very high matchesPlayed", () => {
    const [, , , , experience] = extractFeatures({
      skillLevel: "professional",
      matchesPlayed: 500,
      wins: 400,
      goals: 300,
      assists: 100,
    });
    expect(experience).toBe(1);
  });

  test("returns exactly 5 features, matching FEATURE_NAMES length", () => {
    const features = extractFeatures({
      skillLevel: "advanced",
      matchesPlayed: 20,
      wins: 10,
      goals: 15,
      assists: 5,
    });
    expect(features).toHaveLength(5);
  });
});
