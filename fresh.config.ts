import { defineConfig } from "$fresh/server.ts";
import unocssPlugin from "./plugins/unocss.ts";
import presetUno from "@unocss/preset-uno";
import presetAttributify from "@unocss/preset-attributify";
import transformerAttributifyJsx from "@unocss/transformer-attributify-jsx";
export default defineConfig({
  port: 1111,
  plugins: [unocssPlugin({
    presets: [
      presetUno({ dark: "media" }),
      presetAttributify(),
    ],
    transformers: [
      transformerAttributifyJsx(),
    ],
  }, false)],
});
