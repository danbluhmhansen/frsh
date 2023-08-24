import { defineRoute, Handlers } from "$fresh/server.ts";
import { signal } from "@preact/signals";
import postgres from "postgresjs";
import { Link } from "~components/Link.tsx";
import { Button } from "~components/Button.tsx";

export const handler: Handlers = {
  async POST(req, { params: { gameSlug, actorKindSlug } }) {
    const form = await req.formData();

    const kindId = form.get("kindId")?.toString();
    const name = form.get("name")?.toString();
    if (!kindId || !name) return new Response(null, { status: 400 });

    const description = form.get("description")?.toString() ?? null;

    const sql = postgres();
    const [actor] = await sql`
      INSERT INTO actor (kind_id, name, description) VALUES
        (${kindId}, ${name}, ${description})
      RETURNING slug;`;

    const headers = new Headers();
    headers.set("location", `/games/${gameSlug}/actors/${actorKindSlug}/${actor.slug}`);

    return new Response(null, {
      status: 303,
      headers,
    });
  },
};

export default defineRoute(async ({ url }, { params: { gameSlug, actorKindSlug }, renderNotFound }) => {
  const dialogOpenLink = new URL(url);
  const dialogCloseLink = new URL(url);

  const dialogOpen = signal(dialogOpenLink.searchParams.has("add"));

  dialogOpenLink.searchParams.set("add", "");
  dialogCloseLink.searchParams.delete("add");

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
      {/* @ts-ignore: attributify */}
      <a href={`/games/${gameSlug}`} text="3xl" font="bold" underline="~ hover:violet-300 dark:hover:violet-400">
        {game.name}
      </a>
      <Link href={dialogOpenLink.pathname + dialogOpenLink.search}>Add</Link>
      <ul>
        {actors.map((actor) => (
          <li>
            <a
              href={`/games/${gameSlug}/actors/${actorKindSlug}/${actor.slug}`}
              // @ts-ignore: attributify
              underline="~ hover:violet-300 dark:hover:violet-400"
            >
              {actor.name}
            </a>
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
        <h2 text="xl">Add {actorKind.name}</h2>
        {/* @ts-ignore: attributify */}
        <form method="post" flex="~ col" gap="2">
          <input type="hidden" name="kindId" value={actorKind.id} />
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
            <Link href={dialogCloseLink.pathname + dialogCloseLink.search}>Cancel</Link>
          </div>
        </form>
      </dialog>
    </>
  );
});
