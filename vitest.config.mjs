import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // This component measures `scrollHeight` against `clientHeight` to decide
    // when to grow or shrink, so it can only be tested somewhere with a real
    // layout engine. jsdom reports both as 0, which would make every
    // assertion pass without exercising any of the resizing logic.
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: "chromium" }],
    },
  },
});
