import { defineConfig } from "$fresh/server.ts";
import unocssPlugin from "./plugins/unocss.ts";
import presetUno from "@unocss/preset-uno";
import { presetForms } from "https://esm.sh/@julr/unocss-preset-forms@0.0.5";
import presetIcons from "@unocss/preset-icons";
import tabler from "https://esm.sh/@iconify-json/tabler@1.1.87/icons.json" assert { type: "json" };

export default defineConfig({
  port: 1111,
  plugins: [unocssPlugin({
    presets: [
      presetUno({ dark: "media" }),
      presetForms(),
      presetIcons({
        collections: {
          tabler: () => tabler,
        },
      }),
    ],
  }, false)],
});
