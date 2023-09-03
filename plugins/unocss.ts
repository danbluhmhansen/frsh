import { createGenerator, type UserConfig } from "https://esm.sh/@unocss/core@0.55.2";
import { Plugin } from "$fresh/server.ts";

export default function unocss(config: UserConfig, runtime = true): Plugin {
  return {
    name: "unocss",
    entrypoints: runtime ? { "main": import.meta.resolve("./unocss/main.ts") } : undefined,
    async renderAsync({ renderAsync }) {
      const { htmlText } = await renderAsync();
      const { css } = await createGenerator(config).generate(htmlText, { minify: true });
      return {
        scripts: runtime ? [{ entrypoint: "main", state: {} }] : [],
        styles: [{ cssText: css }],
      };
    },
  };
}
