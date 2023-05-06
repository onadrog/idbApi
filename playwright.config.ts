import { defineConfig, devices  } from "@playwright/test";

export default defineConfig({
    webServer: {
        command: "pnpm run dev",
        url: "http://127.0.0.1:5173",
        reuseExistingServer: true,
    },
    projects: [
        /* Test against desktop browsers */
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],
});
