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
      {/* @ts-ignore: attributify */}
      <h1 text="3xl" font="bold">{game.name}</h1>
      {/* @ts-ignore: attributify */}
      <form method="post" flex="~ col" items="center" justify="center" gap="4">
        <input type="hidden" name="gameId" value={game.id} />
        {/* @ts-ignore: attributify */}
        <div flex="~ row" gap="2">
          <Link href={gameOpen}>
            {/* @ts-ignore: attributify */}
            <div i-tabler-pencil h="4" w="4" />
          </Link>
        </div>
        {/* @ts-ignore: attributify */}
        <ul flex="~ row" gap="4">
          {/* @ts-ignore: attributify */}
          <li flex="~ col" gap="2">
            <h2>Actors</h2>
            {/* @ts-ignore: attributify */}
            <div flex="~ row" gap="2">
              <Link href={actorOpen}>
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
                {actorKinds.map((actorKind) => (
                  <tr>
                    {/* @ts-ignore: attributify */}
                    <td p="2" border="~ slate-300 dark:slate-600">
                      <input
                        type="checkbox"
                        name="slugs"
                        value={actorKind.slug}
                        // @ts-ignore: attributify
                        bg="dark:slate-900"
                        border="dark:white"
                      />
                    </td>
                    {/* @ts-ignore: attributify */}
                    <td p="2" border="~ slate-300 dark:slate-600">
                      <a
                        href={`/games/${gameSlug}/actors/${actorKind.slug}`}
                        // @ts-ignore: attributify
                        text="hover:violet"
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
            {/* @ts-ignore: attributify */}
            <a href={`/games/${gameSlug}/skills`} text="hover:violet">Skills</a>
          </li>
          <li>
            {/* @ts-ignore: attributify */}
            <a href={`/games/${gameSlug}/traits`} text="hover:violet">Traits</a>
          </li>
        </ul>
      </form>
      {gameIsOpen && (
        <Dialog open>
          {/* @ts-ignore: attributify */}
          <h2 text="xl">Edit Game</h2>
          {/* @ts-ignore: attributify */}
          <form method="post" flex="~ col" justify="center" gap="4">
            <input type="hidden" name="id" value={game.id} />
            <input
              type="text"
              name="name"
              value={game.name}
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
              value={game.description}
              placeholder="Description"
              // @ts-ignore: attributify
              bg="dark:slate-900"
              border="~ invalid:red"
              p="x-2 y-1"
              rounded
            />
            {/* @ts-ignore: attributify */}
            <div flex justify="between">
              <Button type="submit" name="submit" value={PARAM_EDIT}>
                {/* @ts-ignore: attributify */}
                <div i-tabler-check h="4" w="4" />
              </Button>
              <Link href={gameClose}>
                {/* @ts-ignore: attributify */}
                <div i-tabler-x h="4" w="4" />
              </Link>
            </div>
          </form>
        </Dialog>
      )}
      {actorIsOpen && (
        <Dialog open>
          {/* @ts-ignore: attributify */}
          <h2 text="xl">Add Actor Kind</h2>
          {/* @ts-ignore: attributify */}
          <form method="post" flex="~ col" justify="center" gap="4">
            <input type="hidden" name="gameId" value={game.id} />
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
              <Link href={actorClose}>
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
