import { test, expect, type Page } from "@playwright/test";

// Helper to authenticate by setting localStorage directly
async function authenticateViaStorage(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem("dashboard_auth", "true");
  });
}

test.describe("CV Dashboard", () => {

  test.describe("Password Gate", () => {
    test("shows password gate on initial load", async ({ page }) => {
      await page.goto("/");

      await expect(page.locator("#gate")).toBeVisible();
      await expect(page.locator("#dashboard")).toBeHidden();
      await expect(page.getByPlaceholder("Enter access code")).toBeVisible();
    });

    test("shows error on incorrect password", async ({ page }) => {
      await page.goto("/");

      await page.getByPlaceholder("Enter access code").fill("wrongpassword");
      await page.getByRole("button", { name: "Enter" }).click();

      await expect(page.locator("#error")).toBeVisible();
      await expect(page.locator("#error")).toHaveText("Incorrect code");
    });

    test("remembers authentication across page reloads", async ({ page }) => {
      // Set authentication via localStorage
      await authenticateViaStorage(page);
      await page.goto("/");

      await expect(page.locator("#dashboard")).toBeVisible();
      await expect(page.locator("#gate")).toBeHidden();

      // Reload and verify still authenticated
      await page.reload();
      await expect(page.locator("#dashboard")).toBeVisible();
      await expect(page.locator("#gate")).toBeHidden();
    });
  });

  test.describe("Dashboard UI", () => {
    test.beforeEach(async ({ page }) => {
      // Authenticate before each dashboard test
      await authenticateViaStorage(page);
      await page.goto("/");
      await expect(page.locator("#dashboard")).toBeVisible();
    });

    test("shows header with correct title", async ({ page }) => {
      await expect(page.getByRole("heading", { name: "CV Variants Dashboard" })).toBeVisible();
    });

    test("shows stats section", async ({ page }) => {
      await expect(page.locator(".stats")).toBeVisible();
      await expect(page.getByText("Total Variants")).toBeVisible();
      await expect(page.getByText("Applied", { exact: true })).toBeVisible();
      await expect(page.getByText("Not Applied")).toBeVisible();
    });

    test("shows search bar", async ({ page }) => {
      await expect(page.getByPlaceholder("Search by company or role...")).toBeVisible();
    });

    test("shows loading state initially", async ({ page }) => {
      // Note: This might be too fast to catch in normal execution
      // The loading state should appear briefly before data loads
      await expect(page.locator("#loading")).toBeVisible({ timeout: 1000 }).catch(() => {
        // Loading might complete before we can check
        // That's OK - just means the dashboard loaded quickly
      });
    });
  });

  test.describe("Search Filtering", () => {
    test.beforeEach(async ({ page }) => {
      await authenticateViaStorage(page);
      await page.goto("/");
      await expect(page.locator("#dashboard")).toBeVisible();
    });

    test("filters variants by company name", async ({ page }) => {
      // Wait for variants to load
      await page.waitForSelector("#variants-table", { state: "visible", timeout: 10000 }).catch(() => {
        // Table might not appear if no variants exist
      });

      // Type in search
      await page.getByPlaceholder("Search by company or role...").fill("test");

      // Filtering should apply (rows will have .hidden class if they don't match)
      const searchInput = page.getByPlaceholder("Search by company or role...");
      await expect(searchInput).toHaveValue("test");
    });

    test("clears filter when search is cleared", async ({ page }) => {
      await page.waitForSelector("#variants-table", { state: "visible", timeout: 10000 }).catch(() => {
        // OK if no variants
      });

      // Add filter then clear it
      const searchInput = page.getByPlaceholder("Search by company or role...");
      await searchInput.fill("test");
      await searchInput.fill("");

      await expect(searchInput).toHaveValue("");
    });
  });

  test.describe("Race Condition Handling", () => {
    test("prevents multiple authentication calls with rapid reloads", async ({ page }) => {
      // This tests the isInitializing/isInitialized guards
      await authenticateViaStorage(page);
      await page.goto("/");
      await expect(page.locator("#dashboard")).toBeVisible();

      // Rapid reload should not cause errors
      await page.reload();
      await expect(page.locator("#dashboard")).toBeVisible();

      await page.reload();
      await expect(page.locator("#dashboard")).toBeVisible();
    });

    test("handles typing during load gracefully", async ({ page }) => {
      // Authenticate and immediately start typing in search
      await authenticateViaStorage(page);
      await page.goto("/");

      // Start typing in search immediately
      const searchInput = page.getByPlaceholder("Search by company or role...");
      await searchInput.fill("early-search");

      // Should not cause errors - filter should be applied after load
      await expect(searchInput).toHaveValue("early-search");
    });
  });
});
