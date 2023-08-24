import { defineRoute, Handlers } from "$fresh/server.ts";
import { signal } from "@preact/signals";
import postgres from "postgresjs";
import { Link } from "~components/Link.tsx";
import { Button } from "~components/Button.tsx";

const PARAM_ADD = "add";
const PARAM_EDIT = "edit";

const FIELDS_GAME = [
  {
    type: "text",
    name: "gameName",
    placeholder: "Name",
    required: true,
  },
  {
    type: "text",
    name: "gameDescription",
    placeholder: "Description",
  },
];

const FIELDS_ACTOR = [
  {
    type: "text",
    name: "actorName",
    placeholder: "Name",
    required: true,
  },
  {
    type: "text",
    name: "actorDescription",
    placeholder: "Description",
  },
];

export const handler: Handlers = {
  async POST(req, { render }) {
    const url = new URL(req.url);
    const form = await req.formData();

    if (url.searchParams.has(PARAM_EDIT)) {
      const fields = FIELDS_GAME.map((field) => ({ ...field, value: form.get(field.name)?.toString() }));

      const id = form.get("gameId")?.toString();
      if (!id || fields.some((field) => field.required && !field.value)) return new Response(null, { status: 400 });

      const name = fields.find((field) => field.name === "gameName")?.value ?? null;
      const description = fields.find((field) => field.name === "gameDescription")?.value ?? null;

      const sql = postgres();
      const [game] = await sql`
        UPDATE game
        SET name = ${name}, description = ${description}
        WHERE id = ${id}
        RETURNING slug;
      `;

      url.searchParams.delete(PARAM_ADD);

      const headers = new Headers();
      headers.set("location", `/games/${game.slug}${url.search}`);

      return new Response(null, { status: 303, headers });
    } else if (url.searchParams.has(PARAM_ADD)) {
      const fields = FIELDS_ACTOR.map((field) => ({ ...field, value: form.get(field.name)?.toString() }));

      const gameId = form.get("actorGameId")?.toString();
      if (!gameId || fields.some((field) => field.required && !field.value)) return new Response(null, { status: 400 });

      const name = fields.find((field) => field.name === "actorName")?.value ?? null;
      const description = fields.find((field) => field.name === "actorDescription")?.value ?? null;

      const sql = postgres();
      await sql`INSERT INTO actor_kind (game_id, name, description) VALUES (${gameId}, ${name}, ${description});`;

      url.searchParams.delete(PARAM_ADD);

      const headers = new Headers();
      headers.set("location", url.pathname + url.search);

      return new Response(null, { status: 303, headers });
    } else {
      const slugs = form.getAll("actorSlugs").map((slug) => slug.toString());
      if (slugs.length < 1) return await render();

      const sql = postgres();
      await sql`DELETE FROM actor_kind WHERE slug IN ${sql(slugs)}`;

      return await render();
    }
  },
};

export default defineRoute(async ({ url }, { params: { gameSlug }, renderNotFound }) => {
  const gameOpenLink = new URL(url);
  const gameCloseLink = new URL(url);

  const gameOpen = signal(gameOpenLink.searchParams.has(PARAM_EDIT));

  gameOpenLink.searchParams.set(PARAM_EDIT, "");
  gameOpenLink.searchParams.delete(PARAM_ADD);
  gameCloseLink.searchParams.delete(PARAM_EDIT);

  const actorOpenLink = new URL(url);
  const actorCloseLink = new URL(url);

  const actorOpen = signal(actorOpenLink.searchParams.has(PARAM_ADD));

  actorOpenLink.searchParams.set(PARAM_ADD, "");
  actorOpenLink.searchParams.delete(PARAM_EDIT);
  actorCloseLink.searchParams.delete(PARAM_ADD);

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
        {/* @ts-ignore: attributify */}
        <div flex="~ row" gap="2">
          <Link href={gameOpenLink.pathname + gameOpenLink.search}>
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
              <Link href={actorOpenLink.pathname + actorOpenLink.search}>
                {/* @ts-ignore: attributify */}
                <div i-tabler-plus h="4" w="4" />
              </Link>
              <Button type="submit" formNoValidate>
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
                        name="actorSlugs"
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
                        underline="~ hover:violet-300 dark:hover:violet-400"
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
          <input type="hidden" name="gameId" value={game.id} />
          {FIELDS_GAME.map((field) => (
            <input
              type={field.type}
              name={field.name}
              value=""
              placeholder={field.placeholder}
              required={field.required}
              // @ts-ignore: attributify
              bg="dark:slate-900"
              border="~ invalid:red"
              p="x-2 y-1"
              rounded
            />
          ))}
          {/* @ts-ignore: attributify */}
          <div flex justify="between">
            <Button type="submit">Submit</Button>
            <Link href={gameCloseLink.pathname + gameCloseLink.search}>Cancel</Link>
          </div>
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
          <input type="hidden" name="actorGameId" value={game.id} />
          {FIELDS_ACTOR.map((field) => (
            <input
              type={field.type}
              name={field.name}
              value=""
              placeholder={field.placeholder}
              required={field.required}
              // @ts-ignore: attributify
              bg="dark:slate-900"
              border="~ invalid:red"
              p="x-2 y-1"
              rounded
            />
          ))}
          {/* @ts-ignore: attributify */}
          <div flex justify="between">
            <Button type="submit">Submit</Button>
            <Link href={actorCloseLink.pathname + actorCloseLink.search}>Cancel</Link>
          </div>
        </dialog>
      </form>
    </>
  );
});
