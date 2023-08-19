import { Head } from "$fresh/runtime.ts";

export default function Error404() {
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
        // @ts-ignore: attributify
        m="y-6"
      />
      {/* @ts-ignore: attributify */}
      <h1 text="3xl" font="bold">404 - Page not found</h1>
      {/* @ts-ignore: attributify */}
      <p m="y-4">
        The page you were looking for doesn't exist.
      </p>
    </>
  );
}
