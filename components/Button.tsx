import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      // @ts-ignore: attributify
      bg="transparent hover:yellow-500 dark:hover:yellow-400"
      border="~ yellow-600 dark:yellow-300"
      font="medium"
      outline="focus:none"
      p="x-4 y-2"
      ring="focus:4 focus:yellow-400 dark:focus:yellow-500"
      rounded
      text="sm center hover:white yellow-600 dark:yellow-300"
    />
  );
}
