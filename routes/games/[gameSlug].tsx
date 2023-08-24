import { defineRoute, Handlers } from "$fresh/server.ts";
import { signal } from "@preact/signals";
import postgres from "postgresjs";
import { Link } from "~components/Link.tsx";
import { Button } from "~components/Button.tsx";

export const handler: Handlers = {
  async POST(req) {
    const form = await req.formData();

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

    const headers = new Headers();
    headers.set("location", `/games/${game.slug}`);

    return new Response(null, {
      status: 303,
      headers,
    });
  },
};

export default defineRoute(async ({ url }, { params: { gameSlug }, renderNotFound }) => {
  const gameOpenLink = new URL(url);
  const gameCloseLink = new URL(url);

  const gameOpen = signal(gameOpenLink.searchParams.has("edit"));

  gameOpenLink.searchParams.set("edit", "");
  gameCloseLink.searchParams.delete("edit");

  const actorOpenLink = new URL(url);
  const actorCloseLink = new URL(url);

  const actorOpen = signal(actorOpenLink.searchParams.has("actoradd"));

  actorOpenLink.searchParams.set("actoradd", "");
  actorCloseLink.searchParams.delete("actoradd");

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
      <Link href={gameOpenLink.pathname + gameOpenLink.search}>Edit</Link>
      {/* @ts-ignore: attributify */}
      <ul flex="~ row" gap="4">
        {/* @ts-ignore: attributify */}
        <li flex="~ col" gap="2">
          <h2>Actors</h2>
          <Link href={gameOpenLink.pathname + gameOpenLink.search}>Add</Link>
          <ul>
            {actorKinds.map((actorKind) => (
              <li>
                <a
                  href={`/games/${gameSlug}/actors/${actorKind.slug}`}
                  // @ts-ignore: attributify
                  underline="~ hover:violet-300 dark:hover:violet-400"
                >
                  {actorKind.name}
                </a>
              </li>
            ))}
          </ul>
        </li>
        <li>
          {/* @ts-ignore: attributify */}
          <a href={`/games/${gameSlug}/skills`} underline="~ hover:violet-300 dark:hover:violet-400">Skills</a>
        </li>
        <li>
          {/* @ts-ignore: attributify */}
          <a href={`/games/${gameSlug}/traits`} underline="~ hover:violet-300 dark:hover:violet-400">Traits</a>
        </li>
      </ul>
      <dialog
        open={gameOpen}
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
        <h2 text="xl">Edit Game</h2>
        {/* @ts-ignore: attributify */}
        <form method="post" flex="~ col" gap="2">
          <input type="hidden" name="id" value={game.id} />
          <input
            type="text"
            name="name"
            defaultValue={game.name}
            value=""
            placeholder="Name"
            required
            // @ts-ignore: attributify
            bg="dark:slate-900"
            border="~ invalid:red"
            p="x-2 y-1"
            rounded
          />
          <input
            type="text"
            name="description"
            defaultValue={game.description}
            value=""
            placeholder="Description"
            // @ts-ignore: attributify
            bg="dark:slate-900"
            border="~ invalid:red"
            p="x-2 y-1"
            rounded
          />
          {/* @ts-ignore: attributify */}
          <div flex justify="between">
            <Button type="submit">Submit</Button>
            <Link href={gameCloseLink.pathname + gameCloseLink.search}>Cancel</Link>
          </div>
        </form>
      </dialog>
      <dialog
        open={actorOpen}
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
        <h2 text="xl">Add Actor Kind</h2>
        {/* @ts-ignore: attributify */}
        <form method="post" flex="~ col" gap="2">
          <input type="hidden" name="gameId" value={game.id} />
          <input
            type="text"
            name="name"
            value=""
            placeholder="Name"
            required
            // @ts-ignore: attributify
            bg="dark:slate-900"
            border="~ invalid:red"
            p="x-2 y-1"
            rounded
          />
          <input
            type="text"
            name="description"
            value=""
            placeholder="Description"
            // @ts-ignore: attributify
            bg="dark:slate-900"
            border="~ invalid:red"
            p="x-2 y-1"
            rounded
          />
          {/* @ts-ignore: attributify */}
          <div flex justify="between">
            <Button type="submit">Submit</Button>
            <Link href={gameCloseLink.pathname + gameCloseLink.search}>Cancel</Link>
          </div>
        </form>
      </dialog>
    </>
  );
});
