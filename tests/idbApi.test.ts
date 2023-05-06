import { test, expect } from "@playwright/test";

test.beforeEach(async function ({ page }) {
	await page.goto("http://127.0.0.1:5173");
	await page.locator("#add").click(); // IDb {name: "data1", id: 1}
});

test("it should get a data", async function ({ page }) {
	await page.locator("#get").click();
	await expect(page.locator("#data")).toHaveText("data1");
});

test("it should update data", async function ({ page }) {
	await page.locator("#upd").click();
	await page.locator("#get").click();
	await expect(page.locator("#data")).toHaveText("data2");
});

test("it should delete", async function ({ page }) {
	await page.locator("#del").click();
	await expect(page.locator("#data")).toHaveText("data deleted");
});
