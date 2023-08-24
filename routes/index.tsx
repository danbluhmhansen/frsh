import { useSignal } from "@preact/signals";
import { Handlers } from "$fresh/server.ts";
import Counter from "~islands/Counter.tsx";
import { Button } from "~components/Button.tsx";

export const handler: Handlers = {
  async POST(req) {
    const form = await req.formData();
    const email = form.get("email")?.toString();
    console.log(email);
    const headers = new Headers();
    headers.set("location", "/");
    return new Response(null, {
      status: 303, // See Other
      headers,
    });
  },
};

export default function Page() {
  const count = useSignal(3);
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
      {/* @ts-ignore: attributify */}
      <form method="post" flex="~ col" gap="2">
        {/* @ts-ignore: attributify */}
        <input type="text" name="email" value="" bg="dark:slate-900" border="~ invalid:red" p="x-2 y-1" rounded />
        <Button type="submit">Subscribe</Button>
      </form>
    </>
  );
}
