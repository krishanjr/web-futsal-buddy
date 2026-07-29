// eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest loads this config file via CommonJS
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Path to Next.js app to load next.config.js and .env files
  dir: "./",
});

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleDirectories: ["node_modules", "<rootDir>"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "!**/*.d.ts",
  ],
};

// createJestConfig is exported this way to ensure next/jest can load the
// Next.js config, which is async
module.exports = createJestConfig(customJestConfig);
