import { Head } from "$fresh/runtime.ts";
import { defineRoute } from "$fresh/server.ts";

export default defineRoute(() => {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <img
        src="/logo.svg"
        width="128"
        height="128"
        alt="the Fresh logo: a sliced lemon dripping with juice"
        class="my-6"
      />
      <h1 class="text-3xl font-bold">404 - Page not found</h1>
      <p class="my-4">
        The page you were looking for doesn't exist.
      </p>
    </>
  );
});
