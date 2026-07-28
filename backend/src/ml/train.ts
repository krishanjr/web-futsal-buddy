/**
 * Trains the Player Strength model.
 *
 * Run: npm run train:ml   (from backend/backend)
 *
 * WHY SYNTHETIC DATA: this is a brand-new platform with no historical
 * match-outcome data yet (no ground truth for "who actually won because
 * they were stronger"). So we bootstrap with a domain-heuristic label
 * generator (a futsal coach's rule of thumb, plus random noise to simulate
 * real-world variance) and fit a real linear regression to it via gradient
 * descent — the model does not memorize the heuristic's exact weights, it
 * has to recover an approximation of them from noisy (feature, label)
 * pairs, same as any regression problem.
 *
 * Once the platform has real match results (completed bookings + a
 * win/loss outcome), swap `generateLabel()` for a query against real
 * historical data and rerun this script — the training loop itself
 * (gradient descent below) does not change.
 */
import * as fs from "fs";
import * as path from "path";
import { extractFeatures, FEATURE_NAMES, PlayerStatsInput } from "./features";

const OUTPUT_PATH = path.join(__dirname, "model-weights.json");

// ─── 1. Synthetic labeled dataset ──────────────────────────────────────────

function randomSkillLevel(): PlayerStatsInput["skillLevel"] {
    const levels: PlayerStatsInput["skillLevel"][] = [
        "beginner",
        "intermediate",
        "advanced",
        "professional",
    ];
    return levels[Math.floor(Math.random() * levels.length)];
}

function gaussianNoise(stdDev: number): number {
    // Box-Muller transform
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z * stdDev;
}

function generateSample(): { input: PlayerStatsInput; label: number } {
    const skillLevel = randomSkillLevel();
    const matchesPlayed = Math.floor(Math.random() * 60);
    const winRateTruth = Math.random() * 0.8 + Math.random() * 0.2; // skewed 0..1
    const wins = Math.round(matchesPlayed * Math.min(winRateTruth, 1));
    const goals = Math.round(matchesPlayed * Math.random() * 1.2);
    const assists = Math.round(matchesPlayed * Math.random() * 0.8);

    const input: PlayerStatsInput = { skillLevel, matchesPlayed, wins, goals, assists };

    // Domain-heuristic ground truth (0-100 strength scale)
    const skillScore = { beginner: 1, intermediate: 2, advanced: 3, professional: 4 }[skillLevel];
    const winRate = matchesPlayed > 0 ? wins / matchesPlayed : 0;
    const goalsPerMatch = matchesPlayed > 0 ? goals / matchesPlayed : 0;
    const assistsPerMatch = matchesPlayed > 0 ? assists / matchesPlayed : 0;
    const experience = Math.min(matchesPlayed, 50) / 50;

    const trueLabel =
        15 * skillScore +
        25 * winRate +
        12 * goalsPerMatch +
        8 * assistsPerMatch +
        15 * experience +
        gaussianNoise(4); // real-world noise

    const label = Math.max(0, Math.min(100, trueLabel));
    return { input, label };
}

const DATASET_SIZE = 2000;
const dataset = Array.from({ length: DATASET_SIZE }, generateSample);

// 80/20 train/test split
const splitIdx = Math.floor(DATASET_SIZE * 0.8);
const trainSet = dataset.slice(0, splitIdx);
const testSet = dataset.slice(splitIdx);

// ─── 2. Feature normalization (z-score) ────────────────────────────────────

const trainFeatures = trainSet.map((s) => extractFeatures(s.input));
const numFeatures = FEATURE_NAMES.length;

const means = new Array(numFeatures).fill(0);
const stds = new Array(numFeatures).fill(1);

for (let j = 0; j < numFeatures; j++) {
    const col = trainFeatures.map((f) => f[j]);
    const mean = col.reduce((a, b) => a + b, 0) / col.length;
    const variance = col.reduce((a, b) => a + (b - mean) ** 2, 0) / col.length;
    means[j] = mean;
    stds[j] = Math.sqrt(variance) || 1;
}

function normalize(features: number[]): number[] {
    return features.map((f, j) => (f - means[j]) / stds[j]);
}

// ─── 3. Batch gradient descent for linear regression ───────────────────────

let weights = new Array(numFeatures).fill(0);
let bias = 0;
const learningRate = 0.1;
const epochs = 500;

const X = trainSet.map((s) => normalize(extractFeatures(s.input)));
const y = trainSet.map((s) => s.label);
const n = X.length;

for (let epoch = 0; epoch < epochs; epoch++) {
    const gradW = new Array(numFeatures).fill(0);
    let gradB = 0;

    for (let i = 0; i < n; i++) {
        const prediction = X[i].reduce((sum, x, j) => sum + x * weights[j], bias);
        const error = prediction - y[i];
        for (let j = 0; j < numFeatures; j++) {
            gradW[j] += (error * X[i][j]) / n;
        }
        gradB += error / n;
    }

    for (let j = 0; j < numFeatures; j++) {
        weights[j] -= learningRate * gradW[j];
    }
    bias -= learningRate * gradB;
}

// ─── 4. Evaluate on held-out test set ──────────────────────────────────────

function predict(features: number[]): number {
    const normalized = normalize(features);
    const raw = normalized.reduce((sum, x, j) => sum + x * weights[j], bias);
    return Math.max(0, Math.min(100, raw));
}

const testPredictions = testSet.map((s) => predict(extractFeatures(s.input)));
const testLabels = testSet.map((s) => s.label);

const mae =
    testPredictions.reduce((sum, pred, i) => sum + Math.abs(pred - testLabels[i]), 0) /
    testPredictions.length;

const meanLabel = testLabels.reduce((a, b) => a + b, 0) / testLabels.length;
const ssTot = testLabels.reduce((sum, l) => sum + (l - meanLabel) ** 2, 0);
const ssRes = testPredictions.reduce((sum, pred, i) => sum + (pred - testLabels[i]) ** 2, 0);
const r2 = 1 - ssRes / ssTot;

console.log(`Training complete on ${trainSet.length} samples, tested on ${testSet.length}.`);
console.log(`  Test MAE: ${mae.toFixed(2)} (avg strength points off, scale 0-100)`);
console.log(`  Test R²:  ${r2.toFixed(3)} (1.0 = perfect fit)`);
console.log(`  Learned weights:`, FEATURE_NAMES.map((n, j) => `${n}=${weights[j].toFixed(2)}`).join(", "));

// ─── 5. Persist weights + normalization params ─────────────────────────────

const modelArtifact = {
    version: 1,
    trainedAt: new Date().toISOString(),
    featureNames: FEATURE_NAMES,
    means,
    stds,
    weights,
    bias,
    metrics: { mae, r2, trainSize: trainSet.length, testSize: testSet.length },
};

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(modelArtifact, null, 2));
console.log(`\n✅ Model saved to ${OUTPUT_PATH}`);
