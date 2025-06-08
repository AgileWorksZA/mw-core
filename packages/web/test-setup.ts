import { GlobalRegistrator } from "@happy-dom/global-registrator";

// Register happy-dom globally to provide browser-like environment
GlobalRegistrator.register();

// Mock localStorage
const localStorageMock: Storage = (() => {
  let store: Record<string, string> = {};
  
  const storage = {
    getItem: (key: string) => {
      return store[key] || null;
    },
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
    get length() {
      return Object.keys(store).length;
    }
  };
  
  return storage as Storage;
})();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Mock fetch for tests
global.fetch = async (url: RequestInfo | URL, init?: RequestInit) => {
  const urlString = url.toString();
  
  // Mock responses for API endpoints
  if (urlString.includes("/api/context/")) {
    return {
      ok: true,
      json: async () => ({ success: true }),
      text: async () => "OK",
      status: 200,
    } as Response;
  }
  
  throw new Error(`Unmocked fetch: ${urlString}`);
};