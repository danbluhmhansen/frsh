import { defineRoute, Handlers } from "$fresh/server.ts";
import { signal } from "@preact/signals";
import postgres from "postgresjs";
import { Link } from "~components/Link.tsx";
import { Button } from "~components/Button.tsx";

export const handler: Handlers = {
  async POST(req) {
    const form = await req.formData();

    const name = form.get("name")?.toString();
    if (!name) return new Response(null, { status: 400 });

    const sql = postgres();
    await sql`INSERT INTO game (name) VALUES (${name});`;

    const headers = new Headers();
    headers.set("location", "/games");

    return new Response(null, {
      status: 303,
      headers,
    });
  },
};

export default defineRoute(async ({ url }) => {
  const dialogOpenLink = new URL(url);
  const dialogCloseLink = new URL(url);

  const dialogOpen = signal(dialogOpenLink.searchParams.has("new"));

  dialogOpenLink.searchParams.set("new", "");
  dialogCloseLink.searchParams.delete("new");

  const sql = postgres();
  const games = await sql`SELECT name, slug FROM game;`;

  return (
    <>
      {/* @ts-ignore: attributify */}
      <h1 text="3xl" font="bold">Games</h1>
      <Link href={dialogOpenLink.pathname + dialogOpenLink.search}>+</Link>
      <ul>
        {games.map((game) => (
          <li>
            <a href={`/games/${game.slug}`}>{game.name}</a>
          </li>
        ))}
      </ul>
      <dialog
        open={dialogOpen}
        // @ts-ignore: attributify
        bg="slate-100 dark:slate-800"
        text="dark:white"
        rounded
        border
        min-w="sm"
        flex="open:~ open:col"
        gap="4"
      >
        {/* @ts-ignore: attributify */}
        <h2 text="xl">New game</h2>
        {/* @ts-ignore: attributify */}
        <form method="post" flex="~ col" gap="2">
          <input
            type="text"
            name="name"
            value=""
            placeholder="Name"
            // @ts-ignore: attributify
            bg="dark:slate-900"
            border="~ invalid:red"
            p="x-2 y-1"
            rounded
          />
          {/* @ts-ignore: attributify */}
          <div flex justify="between">
            <Button type="submit">Submit</Button>
            <Link href={dialogCloseLink.pathname + dialogCloseLink.search}>Cancel</Link>
          </div>
        </form>
      </dialog>
    </>
  );
});
