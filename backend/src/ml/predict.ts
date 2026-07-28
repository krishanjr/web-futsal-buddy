import * as fs from "fs";
import * as path from "path";
import { extractFeatures, PlayerStatsInput } from "./features";

const WEIGHTS_PATH = path.join(__dirname, "model-weights.json");

interface ModelArtifact {
    version: number;
    trainedAt: string;
    featureNames: readonly string[];
    means: number[];
    stds: number[];
    weights: number[];
    bias: number;
    metrics: { mae: number; r2: number; trainSize: number; testSize: number };
}

let cachedModel: ModelArtifact | null = null;

function loadModel(): ModelArtifact {
    if (cachedModel) return cachedModel;

    if (!fs.existsSync(WEIGHTS_PATH)) {
        throw new Error(
            "ML model not trained yet. Run `npm run train:ml` in the backend to generate model-weights.json."
        );
    }

    cachedModel = JSON.parse(fs.readFileSync(WEIGHTS_PATH, "utf-8"));
    return cachedModel as ModelArtifact;
}

/**
 * Predicts a 0-100 "strength score" for a player from their raw stats,
 * using the trained linear regression model.
 */
export function predictStrength(input: PlayerStatsInput): number {
    const model = loadModel();
    const features = extractFeatures(input);
    const normalized = features.map((f, j) => (f - model.means[j]) / model.stds[j]);
    const raw = normalized.reduce((sum, x, j) => sum + x * model.weights[j], model.bias);
    return Math.round(Math.max(0, Math.min(100, raw)) * 10) / 10;
}

export function getModelInfo() {
    const model = loadModel();
    return {
        version: model.version,
        trainedAt: model.trainedAt,
        metrics: model.metrics,
    };
}
