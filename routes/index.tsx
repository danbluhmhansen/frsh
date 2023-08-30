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
        class="my-6"
      />
      <h1 class="text-3xl font-bold">Welcome to Fresh</h1>
      <p class="my-4">
        Try updating this message in the
        <code class="mx-2">./routes/index.tsx</code> file, and refresh.
      </p>
      <Counter count={count} />
      <form method="post" class="flex flex-col gap-2">
        <input
          type="text"
          name="email"
          value=""
          class="dark:bg-slate-900 border invalid:border-red px-2 py-1 rounded"
        />
        <Button type="submit">Subscribe</Button>
      </form>
    </>
  );
}
