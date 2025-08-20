import type { Config } from "jest";

const config: Config = {
  // Use the "projects" key to run multiple test configurations
  projects: [
    {
      // Configuration for backend/Node.js files
      displayName: "node",
      testEnvironment: "node",
      preset: "ts-jest",
      // Test only .ts files, assuming they are your backend code
      testMatch: ["<rootDir>/app/**/*.test.ts"], 
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
      },
    },
    {
      // Configuration for UI components that require a browser environment
      displayName: "jsdom",
      testEnvironment: "jsdom",
      // Explicitly use babel-jest for .tsx files to handle JSX
      transform: {
        "^.+\\.(ts|tsx)$": "babel-jest",
      },
      // Setup file for React Testing Library and jest-dom matchers
      setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
      // Test only .tsx files, assuming they are your UI components
      testMatch: ["<rootDir>/app/**/*.test.tsx"],
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
      },
      collectCoverage: true,
      coverageDirectory: "coverage",
      coverageReporters: ["text", "lcov", "html", "json"],
      collectCoverageFrom: [
        "app/**/*.{ts,tsx}",
        "!app/**/*.d.ts",
        "!app/**/node_modules/**",
        "!app/**/*.config.{js,ts}",
        "!app/**/coverage/**",
        "!app/**/*.test.{ts,tsx}",
        "!app/**/*.spec.{ts,tsx}",
      ],
      coverageThreshold: {
        global: {
          branches: 50,
          functions: 50,
          lines: 50,
          statements: 50,
        },
      },
    },
  ],
};

export default config;