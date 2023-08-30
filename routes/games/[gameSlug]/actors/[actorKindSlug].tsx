import { defineRoute, Handlers } from "$fresh/server.ts";
import postgres from "postgresjs";
import { Link } from "~components/Link.tsx";
import { Button } from "~components/Button.tsx";
import { Dialog } from "~components/Dialog.tsx";
import { initDialog } from "~utils/utils.ts";

const PARAM_ADD = "add";

export const handler: Handlers = {
  async POST(req, { params: { gameSlug, actorKindSlug }, render }) {
    const form = await req.formData();
    const submit = form.get("submit");

    if (submit === PARAM_ADD) {
      const kindId = form.get("kindId")?.toString();
      const name = form.get("name")?.toString();
      if (!kindId || !name) return new Response(null, { status: 400 });

      const description = form.get("description")?.toString() ?? null;

      const sql = postgres();
      await sql`
        INSERT INTO actor (kind_id, name, description) VALUES
          (${kindId}, ${name}, ${description})
        RETURNING slug;
      `;
      await sql`INSERT INTO game (name, description) VALUES (${name}, ${description});`;

      const url = new URL(req.url);
      url.searchParams.delete(PARAM_ADD);

      const headers = new Headers();
      headers.set("location", `/games/${gameSlug}/actors/${actorKindSlug}`);

      return new Response(null, { status: 303, headers });
    }

    if (submit === "remove") {
      const kindId = form.get("kindId")?.toString();
      const slugs = form.getAll("slugs").map((slug) => slug.toString());
      if (!kindId || slugs.length < 1) return await render();

      const sql = postgres();
      await sql`DELETE FROM actor WHERE kind_id = ${kindId} AND slug IN ${sql(slugs)}`;

      return await render();
    }

    return await render();
  },
};

export default defineRoute(async ({ url }, { params: { gameSlug, actorKindSlug }, renderNotFound }) => {
  const [open, close, isOpen] = initDialog(url, PARAM_ADD);

  const sql = postgres();
  const [game] = await sql`SELECT name FROM game WHERE slug = ${gameSlug};`;

  if (!game) return renderNotFound();

  const [actorKind] = await sql`SELECT id, name FROM actor_kind WHERE slug = ${actorKindSlug};`;

  if (!actorKind) return renderNotFound();

  const actors = await sql`
    SELECT actor.name, actor.slug
    FROM actor
    JOIN actor_kind ON actor_kind.id = actor.kind_id
    WHERE actor_kind.slug = ${actorKindSlug};
  `;

  return (
    <>
      <a href={`/games/${gameSlug}`} class="text-3xl hover:text-violet font-bold">
        {game.name}
      </a>
      <form method="post" class="flex flex-col items-center justify-center gap-4">
        <input type="hidden" name="kindId" value={actorKind.id} />
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
            {actors.map((actor) => (
              <tr>
                <td class="p-2 border border-slate-300 dark:border-slate-600">
                  <input type="checkbox" name="slugs" value={actor.slug} class="dark:bg-slate-900 dark:border-white" />
                </td>
                <td class="p-2 border border-slate-300 dark:border-slate-600">
                  <a
                    href={`/games/${gameSlug}/actors/${actorKindSlug}/${actor.slug}`}
                    class="hover:text-violet"
                  >
                    {actor.name}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
      {isOpen && (
        <Dialog open>
          <h2 class="text-xl">Add {actorKind.name}</h2>
          <form method="post" class="flex flex-col gap-2">
            <input type="hidden" name="kindId" value={actorKind.id} />
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
              <Button type="submit" name="submit" value={PARAM_ADD}>Submit</Button>
              <Link href={close}>Cancel</Link>
            </div>
          </form>
        </Dialog>
      )}
    </>
  );
});
