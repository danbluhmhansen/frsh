import { JSX } from "preact";

export function Dialog(props: JSX.HTMLAttributes<HTMLDialogElement>) {
  return (
    <dialog
      {...props}
      // @ts-ignore: attributify
      bg="slate-100 dark:slate-800"
      text="dark:white"
      rounded
      border
      min-w="sm:sm"
      flex="open:~ open:col"
      gap="4"
    />
  );
}
