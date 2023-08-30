import { JSX } from "preact";

export function Dialog(props: JSX.HTMLAttributes<HTMLDialogElement>) {
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
      <div class="bg-black/50 fixed inset-0" />
    </>
  );
}
