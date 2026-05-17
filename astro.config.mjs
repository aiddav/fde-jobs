import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

const site = process.env.SITE_URL ?? "http://localhost:4321";
const sitePath = new URL(site).pathname.replace(/\/$/, "");

export default defineConfig({
  site,
  base: sitePath && sitePath !== "/" ? sitePath : "/",
  output: "static",
  integrations: [preact(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    }
  }
});
