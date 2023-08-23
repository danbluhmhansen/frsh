import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function Link(props: JSX.HTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      // @ts-ignore: attributify
      bg="transparent hover:violet-500 dark:hover:violet-400"
      border="~ violet-600 dark:violet-300"
      font="medium"
      outline="focus:none"
      p="x-4 y-2"
      ring="focus:4 focus:violet-400 dark:focus:violet-500"
      rounded=""
      text="sm center hover:white violet-600 dark:violet-300"
    />
  );
}
