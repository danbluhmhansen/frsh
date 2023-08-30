import { defineRoute, Handlers } from "$fresh/server.ts";
import postgres from "postgresjs";
import { Link } from "~components/Link.tsx";
import { Button } from "~components/Button.tsx";
import { Dialog } from "~components/Dialog.tsx";
import { initDialog } from "~utils/utils.ts";

const PARAM_ADD = "add";
const PARAM_EDIT = "edit";

export const handler: Handlers = {
  async POST(req, { render }) {
    const form = await req.formData();
    const submit = form.get("submit");

    if (submit === PARAM_EDIT) {
      const id = form.get("id")?.toString();
      const name = form.get("name")?.toString();
      if (!id || !name) return new Response(null, { status: 400 });

      const description = form.get("description")?.toString() ?? null;

      const sql = postgres();
      const [game] = await sql`
        UPDATE game
        SET name = ${name}, description = ${description}
        WHERE id = ${id}
        RETURNING slug;
      `;

      const url = new URL(req.url);
      url.searchParams.delete(PARAM_EDIT);

      const headers = new Headers();
      headers.set("location", `/games/${game.slug}${url.search}`);

      return new Response(null, { status: 303, headers });
    }

    if (submit === PARAM_ADD) {
      const gameId = form.get("gameId")?.toString();
      const name = form.get("name")?.toString();
      if (!gameId || !name) return new Response(null, { status: 400 });

      const description = form.get("description")?.toString() ?? null;

      const sql = postgres();
      await sql`INSERT INTO actor_kind (game_id, name, description) VALUES (${gameId}, ${name}, ${description});`;

      const url = new URL(req.url);
      url.searchParams.delete(PARAM_ADD);

      const headers = new Headers();
      headers.set("location", url.pathname + url.search);

      return new Response(null, { status: 303, headers });
    }

    if (submit === "remove") {
      const gameId = form.get("gameId")?.toString();
      const slugs = form.getAll("slugs").map((slug) => slug.toString());
      if (!gameId || slugs.length < 1) return await render();

      const sql = postgres();
      await sql`DELETE FROM actor_kind WHERE game_id = ${gameId} AND slug IN ${sql(slugs)}`;

      return await render();
    }

    return await render();
  },
};

export default defineRoute(async ({ url }, { params: { gameSlug }, renderNotFound }) => {
  const [gameOpen, gameClose, gameIsOpen] = initDialog(url, PARAM_EDIT, [PARAM_ADD]);
  const [actorOpen, actorClose, actorIsOpen] = initDialog(url, PARAM_ADD, [PARAM_EDIT]);

  const sql = postgres();
  const [game] = await sql`SELECT id, name, description FROM game WHERE slug = ${gameSlug};`;

  if (!game) return renderNotFound();

  const actorKinds = await sql`
    SELECT actor_kind.name, actor_kind.slug
    FROM actor_kind
    JOIN game ON game.id = actor_kind.game_id
    WHERE game.slug = ${gameSlug}
  `;

  return (
    <>
      <h1 class="text-3xl font-bold">{game.name}</h1>
      <form method="post" class="flex flex-col items-center justify-center gap-4">
        <input type="hidden" name="gameId" value={game.id} />
        <div class="flex flex-row gap-2">
          <Link href={gameOpen}>
            <div class="i-tabler-pencil h-4 w-4" />
          </Link>
        </div>
        <ul class="flex flex-row gap-4">
          <li class="flex flex-col gap-2">
            <h2>Actors</h2>
            <div class="flex flex-row gap-2">
              <Link href={actorOpen}>
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
                {actorKinds.map((actorKind) => (
                  <tr>
                    <td class="p-2 border border-slate-300 dark:border-slate-600">
                      <input
                        type="checkbox"
                        name="slugs"
                        value={actorKind.slug}
                        class="dark:bg-slate-900 dark:border-white"
                      />
                    </td>
                    <td class="p-2 border border-slate-300 dark:border-slate-600">
                      <a
                        href={`/games/${gameSlug}/actors/${actorKind.slug}`}
                        class="hover:text-violet"
                      >
                        {actorKind.name}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </li>
          <li>
            <a href={`/games/${gameSlug}/skills`} class="hover:text-violet">Skills</a>
          </li>
          <li>
            <a href={`/games/${gameSlug}/traits`} class="hover:text-violet">Traits</a>
          </li>
        </ul>
      </form>
      {gameIsOpen && (
        <Dialog open>
          <h2 class="text-xl">Edit Game</h2>
          <form method="post" class="flex flex-col justify-center gap-4">
            <input type="hidden" name="id" value={game.id} />
            <input
              type="text"
              name="name"
              value={game.name}
              placeholder="Name"
              required
              autofocus
              class="dark:bg-slate-900 border invalid:border-red px-2 py-1 rounded"
            />
            <textarea
              name="description"
              value={game.description}
              placeholder="Description"
              class="dark:bg-slate-900 border invalid:border-red px-2 py-1 rounded"
            />
            <div class="flex justify-between">
              <Button type="submit" name="submit" value={PARAM_EDIT}>
                <div class="i-tabler-check h-4 w-4" />
              </Button>
              <Link href={gameClose}>
                <div class="i-tabler-x h-4 w-4" />
              </Link>
            </div>
          </form>
        </Dialog>
      )}
      {actorIsOpen && (
        <Dialog open>
          <h2 class="text-xl">Add Actor Kind</h2>
          <form method="post" class="flex flex-col justify-center gap-4">
            <input type="hidden" name="gameId" value={game.id} />
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
              <Link href={actorClose}>
                <div class="i-tabler-x h-4 w-4" />
              </Link>
            </div>
          </form>
        </Dialog>
      )}
    </>
  );
});
