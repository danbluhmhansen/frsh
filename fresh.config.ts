import { defineConfig } from "$fresh/server.ts";
import unocssPlugin from "./plugins/unocss.ts";
import presetUno from "@unocss/preset-uno";
import presetAttributify from "@unocss/preset-attributify";
export default defineConfig({
  port: 1111,
  plugins: [unocssPlugin({
    presets: [
      presetUno({ dark: "media" }),
      presetAttributify({}),
    ],
  }, false)],
});
