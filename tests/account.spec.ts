import { test, expect } from "@playwright/test";
import { login } from "../src/test-utils/playwright";

test("has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(process.env.NEXT_PUBLIC_COMPANY_NAME!);
});

test.describe.configure({ retries: 3 });
test("create account, logout, login", async ({ page }) => {
  const runId = crypto.randomUUID();
  const testUserEmail = `test+${runId}@test.com`;
  const testUserName = `Test user - ${runId}`;

  await page.goto("/", { waitUntil: "networkidle" });

  await login(page, testUserEmail);

  // TODO: there's some issue with how the account-form is being rerendered - it's causing
  // the full name form to clear after the value is filled.
  // Here, we wait for the rendering cycle to stop.
  await page.waitForTimeout(1000);

  await page.getByRole("textbox", { name: "Full Name" }).fill(testUserName);
  await page.getByRole("button", { name: "Update Profile" }).click();
  await expect(page.getByText("Profile updated successfully!")).toBeVisible();

  await page.getByRole("button", { name: "Sign Out" }).click();

  await expect(page).toHaveURL("/auth");

  await login(page, testUserEmail);

  await expect(page.getByRole("textbox", { name: "Full Name" })).toHaveValue(
    testUserName
  );
});
