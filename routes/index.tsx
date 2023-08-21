import { signal } from "@preact/signals";
import { defineRoute } from "$fresh/server.ts";
import Counter from "~islands/Counter.tsx";

export default defineRoute(() => {
  const count = signal(3);
  return (
    <>
      <img
        src="/logo.svg"
        width="128"
        height="128"
        alt="the Fresh logo: a sliced lemon dripping with juice"
        // @ts-ignore: attributify
        m="y-6"
      />
      {/* @ts-ignore: attributify */}
      <h1 text="3xl" font="bold">Welcome to Fresh</h1>
      {/* @ts-ignore: attributify */}
      <p m="y-4">
        Try updating this message in the
        {/* @ts-ignore: attributify */}
        <code m="x-2">./routes/index.tsx</code> file, and refresh.
      </p>
      <Counter count={count} />
    </>
  );
});
