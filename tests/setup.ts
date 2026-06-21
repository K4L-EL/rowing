import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock IntersectionObserver globally — must be a constructor function
vi.stubGlobal(
  "IntersectionObserver",
  class {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = "0px";
    readonly thresholds: ReadonlyArray<number> = [0];
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
  },
);

// Mock fetch globally (individual tests can override with vi.fn())
globalThis.fetch = vi.fn();
