import { defineConfig } from "$fresh/server.ts";
import unocssPlugin from "./plugins/unocss.ts";
import presetUno from "@unocss/preset-uno";
import presetAttributify from "@unocss/preset-attributify";
import presetIcons from "@unocss/preset-icons";
import presetTypography from "@unocss/preset-typography";
import transformerAttributifyJsx from "@unocss/transformer-attributify-jsx";
import tabler from "https://esm.sh/@iconify-json/tabler@1.1.87/icons.json" assert { type: "json" };
export default defineConfig({
  port: 1111,
  plugins: [unocssPlugin({
    presets: [
      presetUno({ dark: "media" }),
      presetAttributify(),
      presetTypography(),
      presetIcons({
        collections: {
          tabler: () => tabler,
        },
      }),
    ],
    transformers: [
      transformerAttributifyJsx(),
    ],
  }, false)],
});
