// jest.setup.ts
import "@testing-library/jest-dom";

// Mock the getComputedStyle method
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: (prop: string) => '',
  }),
});