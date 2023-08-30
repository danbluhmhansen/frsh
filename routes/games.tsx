import { defineRoute, Handlers } from "$fresh/server.ts";
import postgres from "postgresjs";
import { Link } from "~components/Link.tsx";
import { Button } from "~components/Button.tsx";
import { Dialog } from "~components/Dialog.tsx";
import { initDialog } from "~utils/utils.ts";

const PARAM_ADD = "add";

export const handler: Handlers = {
  async POST(req, { render }) {
    const form = await req.formData();
    const submit = form.get("submit");

    if (submit === PARAM_ADD) {
      const name = form.get("name")?.toString();
      if (!name) return new Response(null, { status: 400 });

      const description = form.get("description")?.toString() ?? null;

      const sql = postgres();
      await sql`INSERT INTO game (name, description) VALUES (${name}, ${description});`;

      const url = new URL(req.url);
      url.searchParams.delete(PARAM_ADD);

      const headers = new Headers();
      headers.set("location", url.pathname + url.search);

      return new Response(null, { status: 303, headers });
    }

    if (submit === "remove") {
      const slugs = form.getAll("slugs").map((slug) => slug.toString());
      if (slugs.length < 1) return await render();

      const sql = postgres();
      await sql`DELETE FROM game WHERE slug IN ${sql(slugs)}`;

      return await render();
    }

    return await render();
  },
};

export default defineRoute(async ({ url }) => {
  const [open, close, isOpen] = initDialog(url, PARAM_ADD);

  const sql = postgres();
  const games = await sql`SELECT name, slug FROM game;`;

  return (
    <>
      {/* @ts-ignore: attributify */}
      <h1 text="3xl" font="bold">Games</h1>
      {/* @ts-ignore: attributify */}
      <form method="post" flex="~ col" items="center" justify="center" gap="4">
        {/* @ts-ignore: attributify */}
        <div flex="~ row" gap="2">
          <Link href={open}>
            {/* @ts-ignore: attributify */}
            <div i-tabler-plus h="4" w="4" />
          </Link>
          <Button type="submit" name="submit" value="remove" color="red">
            {/* @ts-ignore: attributify */}
            <div i-tabler-trash h="4" w="4" />
          </Button>
        </div>
        <table>
          <thead>
            <tr>
              {/* @ts-ignore: attributify */}
              <th p="2" border="~ slate-300 dark:slate-600"></th>
              {/* @ts-ignore: attributify */}
              <th p="2" border="~ slate-300 dark:slate-600">Name</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr>
                {/* @ts-ignore: attributify */}
                <td p="2" border="~ slate-300 dark:slate-600">
                  {/* @ts-ignore: attributify */}
                  <input type="checkbox" name="slugs" value={game.slug} bg="dark:slate-900" border="dark:white" />
                </td>
                {/* @ts-ignore: attributify */}
                <td p="2" border="~ slate-300 dark:slate-600">
                  {/* @ts-ignore: attributify */}
                  <a href={`/games/${game.slug}`} text="hover:violet">{game.name}</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
      {isOpen && (
        <Dialog open>
          {/* @ts-ignore: attributify */}
          <h2 text="xl">Add Game</h2>
          {/* @ts-ignore: attributify */}
          <form method="post" flex="~ col" justify="center" gap="4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              autofocus
              // @ts-ignore: attributify
              bg="dark:slate-900"
              border="~ invalid:red"
              p="x-2 y-1"
              rounded
            />
            <textarea
              name="description"
              placeholder="Description"
              // @ts-ignore: attributify
              bg="dark:slate-900"
              border="~ invalid:red"
              p="x-2 y-1"
              rounded
            />
            {/* @ts-ignore: attributify */}
            <div flex justify="between">
              <Button type="submit" name="submit" value={PARAM_ADD}>
                {/* @ts-ignore: attributify */}
                <div i-tabler-check h="4" w="4" />
              </Button>
              <Link href={close}>
                {/* @ts-ignore: attributify */}
                <div i-tabler-x h="4" w="4" />
              </Link>
            </div>
          </form>
        </Dialog>
      )}
    </>
  );
});
