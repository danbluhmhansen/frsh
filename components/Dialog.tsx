import { JSX } from "preact";

interface DialogProps extends JSX.HTMLAttributes<HTMLDialogElement> {
  close?: string | JSX.SignalLike<string | undefined> | undefined;
}

export function Dialog(props: DialogProps) {
  return (
    <>
      <dialog
        {...props}
        class="
          dark:bg-slate-900
          dark:text-white
          rounded
          border
          sm:min-w-sm
          open:flex open:flex-col
          gap-4
          fixed
          inset-0
          z-1
        "
      />
      <a href={props.close} class="bg-black/50 fixed inset-0" />
    </>
  );
}
