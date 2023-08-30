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
      <h1 class="text-3xl font-bold">Games</h1>
      <form method="post" class="flex flex-col items-center justify-center gap-4">
        <div class="flex flex-row gap-2">
          <Link href={open}>
            <div class="i-tabler-plus h-4 w-4" />
          </Link>
          <Button type="submit" name="submit" value="remove">
            <div class="i-tabler-trash h-4 w-4" />
          </Button>
        </div>
        <table>
          <thead>
            <tr>
              <th class="p-2 border border-slate-300 dark:border-slate-600"></th>
              <th class="p-2 border border-slate-300 dark:border-slate-600">Name</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr>
                <td class="p-2 border border-slate-300 dark:border-slate-600">
                  <input type="checkbox" name="slugs" value={game.slug} class="dark:bg-slate-900 dark:border-white" />
                </td>
                <td class="p-2 border border-slate-300 dark:border-slate-600">
                  <a href={`/games/${game.slug}`} class="hover:text-violet">{game.name}</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
      {isOpen && (
        <Dialog open>
          <h2 class="text-xl">Add Game</h2>
          <form method="post" class="flex flex-col justify-center gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              autofocus
              class="dark:bg-slate-900 border invalid:border-red px-2 py-1 rounded"
            />
            <textarea
              name="description"
              placeholder="Description"
              class="dark:bg-slate-900 border invalid:border-red px-2 py-1 rounded"
            />
            <div class="flex justify-between">
              <Button type="submit" name="submit" value={PARAM_ADD}>
                <div class="i-tabler-check h-4 w-4" />
              </Button>
              <Link href={close}>
                <div class="i-tabler-x h-4 w-4" />
              </Link>
            </div>
          </form>
        </Dialog>
      )}
    </>
  );
});
