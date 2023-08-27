import { JSX } from "preact";

export function Dialog(props: JSX.HTMLAttributes<HTMLDialogElement>) {
  return (
    <>
      <dialog
        {...props}
        // @ts-ignore: attributify
        bg="dark:slate-900"
        text="dark:white"
        rounded
        border
        min-w="sm:sm"
        flex="open:~ open:col"
        gap="4"
        position="fixed"
        inset="0"
        z="1"
      />
      {/* @ts-ignore: attributify */}
      <div bg="black/50" position="fixed" inset="0" />
    </>
  );
}
