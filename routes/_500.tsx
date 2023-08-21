import { Head } from "$fresh/runtime.ts";
import { defineRoute } from "$fresh/server.ts";

export default defineRoute(() => {
  return (
    <>
      <Head>
        <title>500 - Internal server error</title>
      </Head>
      <img
        src="/logo.svg"
        width="128"
        height="128"
        alt="the Fresh logo: a sliced lemon dripping with juice"
        // @ts-ignore: attributify
        m="y-6"
      />
      {/* @ts-ignore: attributify */}
      <h1 text="3xl" font="bold">500 - Internal server error</h1>
    </>
  );
});
