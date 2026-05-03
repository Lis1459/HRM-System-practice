import { vi } from "vitest";
import { config } from "@vue/test-utils";

// Mock PrimeVue Toast
vi.mock("primevue", () => ({
  useToast: vi.fn(() => ({
    add: vi.fn(),
  })),
  useConfirm: vi.fn(() => ({
    require: vi.fn(),
  })),
}));

// Mock useNuxtApp
vi.stubGlobal("useNuxtApp", () => ({
  $apollo: {
    query: vi.fn(),
    mutate: vi.fn(),
  },
}));

// Mock useRouter
vi.stubGlobal("useNuxtApp", () => ({
  push: vi.fn(),
  back: vi.fn(),
}));

// Mock useRoute
vi.stubGlobal("useNuxtApp", () => ({
  params: {},
  query: {},
}));

// Configure Vue Test Utils
config.global.stubs = {
  NuxtLink: true,
  NuxtPage: true,
  ClientOnly: true,
};
