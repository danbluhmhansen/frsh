import { defineRoute, Handlers } from "$fresh/server.ts";
import { signal } from "@preact/signals";
import postgres from "postgresjs";
import { Link } from "~components/Link.tsx";
import { Button } from "~components/Button.tsx";
import { Dialog } from "~components/Dialog.tsx";

const PARAM_ADD = "add";

const FIELDS = [
  {
    type: "text",
    name: "name",
    placeholder: "Name",
    required: true,
  },
  {
    type: "text",
    name: "description",
    placeholder: "Description",
  },
];

export const handler: Handlers = {
  async POST(req, { params: { gameSlug, actorKindSlug }, render }) {
    const url = new URL(req.url);
    const form = await req.formData();

    if (url.searchParams.has(PARAM_ADD)) {
      const fields = FIELDS.map((field) => ({ ...field, value: form.get(field.name)?.toString() }));
      const kindId = form.get("kindId")?.toString();
      if (!kindId || fields.some((field) => field.required && !field.value)) return new Response(null, { status: 400 });

      const name = fields.find((field) => field.name === "name")?.value ?? null;
      const description = fields.find((field) => field.name === "description")?.value ?? null;

      const sql = postgres();
      await sql`
        INSERT INTO actor (kind_id, name, description) VALUES
          (${kindId}, ${name}, ${description})
        RETURNING slug;
      `;
      await sql`INSERT INTO game (name, description) VALUES (${name}, ${description});`;

      url.searchParams.delete(PARAM_ADD);

      const headers = new Headers();
      headers.set("location", `/games/${gameSlug}/actors/${actorKindSlug}`);

      return new Response(null, { status: 303, headers });
    } else {
      const kindId = form.get("kindId")?.toString();
      const slugs = form.getAll("slugs").map((slug) => slug.toString());
      if (!kindId || slugs.length < 1) return await render();

      const sql = postgres();
      await sql`DELETE FROM actor WHERE kind_id = ${kindId} AND slug IN ${sql(slugs)}`;

      return await render();
    }
  },
};

export default defineRoute(async ({ url }, { params: { gameSlug, actorKindSlug }, renderNotFound }) => {
  const dialogOpenLink = new URL(url);
  const dialogCloseLink = new URL(url);

  const dialogOpen = signal(dialogOpenLink.searchParams.has(PARAM_ADD));

  dialogOpenLink.searchParams.set(PARAM_ADD, "");
  dialogCloseLink.searchParams.delete(PARAM_ADD);

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
      {/* @ts-ignore: attributify */}
      <form method="post" flex="~ col" items="center" justify="center" gap="4">
        <input type="hidden" name="kindId" value={actorKind.id} />
        {/* @ts-ignore: attributify */}
        <div flex="~ row" gap="2">
          <Link href={dialogOpenLink.pathname + dialogOpenLink.search}>
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
            {actors.map((actor) => (
              <tr>
                {/* @ts-ignore: attributify */}
                <td p="2" border="~ slate-300 dark:slate-600">
                  {/* @ts-ignore: attributify */}
                  <input type="checkbox" name="slugs" value={actor.slug} bg="dark:slate-900" border="dark:white" />
                </td>
                {/* @ts-ignore: attributify */}
                <td p="2" border="~ slate-300 dark:slate-600">
                  <a
                    href={`/games/${gameSlug}/actors/${actorKindSlug}/${actor.slug}`}
                    // @ts-ignore: attributify
                    underline="~ hover:violet-300 dark:hover:violet-400"
                  >
                    {actor.name}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
      {dialogOpen.value && (
        <Dialog open>
          {/* @ts-ignore: attributify */}
          <h2 text="xl">Add {actorKind.name}</h2>
          {/* @ts-ignore: attributify */}
          <form method="post" flex="~ col" gap="2">
            <input type="hidden" name="kindId" value={actorKind.id} />
            {FIELDS.map((field, i) => (
              <input
                type={field.type}
                name={field.name}
                value=""
                placeholder={field.placeholder}
                required={field.required}
                autofocus={i === 0}
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
              <Link href={dialogCloseLink.pathname + dialogCloseLink.search}>Cancel</Link>
            </div>
          </form>
        </Dialog>
      )}
    </>
  );
});
