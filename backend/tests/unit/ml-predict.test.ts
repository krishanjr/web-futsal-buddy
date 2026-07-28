import { predictStrength, getModelInfo } from "../../src/ml/predict";

describe("ML: predictStrength", () => {
  test("returns a score within the valid 0-100 range for a strong player", () => {
    const score = predictStrength({
      skillLevel: "professional",
      matchesPlayed: 100,
      wins: 80,
      goals: 60,
      assists: 40,
    });
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test("returns a score within the valid 0-100 range for a brand-new player", () => {
    const score = predictStrength({
      skillLevel: "beginner",
      matchesPlayed: 0,
      wins: 0,
      goals: 0,
      assists: 0,
    });
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test("a professional with a strong record scores higher than a beginner with none", () => {
    const pro = predictStrength({
      skillLevel: "professional",
      matchesPlayed: 50,
      wins: 40,
      goals: 30,
      assists: 20,
    });
    const beginner = predictStrength({
      skillLevel: "beginner",
      matchesPlayed: 0,
      wins: 0,
      goals: 0,
      assists: 0,
    });
    expect(pro).toBeGreaterThan(beginner);
  });

  test("is deterministic: same input always produces the same output", () => {
    const input = {
      skillLevel: "intermediate" as const,
      matchesPlayed: 15,
      wins: 7,
      goals: 5,
      assists: 3,
    };
    expect(predictStrength(input)).toBe(predictStrength(input));
  });

  test("getModelInfo exposes version and training metrics", () => {
    const info = getModelInfo();
    expect(info.version).toBeDefined();
    expect(info.metrics).toBeDefined();
    expect(typeof info.metrics.mae).toBe("number");
  });
});
