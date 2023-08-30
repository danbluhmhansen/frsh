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
        class="my-6"
      />
      <h1 class="text-3xl font-bold">500 - Internal server error</h1>
    </>
  );
});
