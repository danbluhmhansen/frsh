import { defineRoute, Handlers } from "$fresh/server.ts";
import { signal } from "@preact/signals";
import postgres from "postgresjs";
import { Link } from "~components/Link.tsx";
import { Button } from "~components/Button.tsx";

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
  async POST(req, { render }) {
    const url = new URL(req.url);
    const form = await req.formData();

    if (url.searchParams.has(PARAM_ADD)) {
      const fields = FIELDS.map((field) => ({ ...field, value: form.get(field.name)?.toString() }));

      if (fields.some((field) => field.required && !field.value)) return new Response(null, { status: 400 });

      const name = fields.find((field) => field.name === "name")?.value ?? null;
      const description = fields.find((field) => field.name === "description")?.value ?? null;

      const sql = postgres();
      await sql`INSERT INTO game (name, description) VALUES (${name}, ${description});`;

      url.searchParams.delete(PARAM_ADD);

      const headers = new Headers();
      headers.set("location", url.pathname + url.search);

      return new Response(null, { status: 303, headers });
    } else {
      const slugs = form.getAll("slugs").map((slug) => slug.toString());
      if (slugs.length < 1) return await render();

      const sql = postgres();
      await sql`DELETE FROM game WHERE slug IN ${sql(slugs)}`;

      return await render();
    }
  },
};

export default defineRoute(async ({ url }) => {
  const dialogOpenLink = new URL(url);
  const dialogCloseLink = new URL(url);

  const dialogOpen = signal(dialogOpenLink.searchParams.has(PARAM_ADD));

  dialogOpenLink.searchParams.set(PARAM_ADD, "");
  dialogCloseLink.searchParams.delete(PARAM_ADD);

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
          <Link href={dialogOpenLink.pathname + dialogOpenLink.search}>
            {/* @ts-ignore: attributify */}
            <div i-tabler-plus h="4" w="4" />
          </Link>
          <Button type="submit" formNoValidate>
            {/* @ts-ignore: attributify */}
            <div i-tabler-trash h="4" w="4" />
          </Button>
        </div>
        {/* @ts-ignore: attributify */}
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
                  <a href={`/games/${game.slug}`} underline="~ hover:violet-300 dark:hover:violet-400">{game.name}</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
          <h2 text="xl">Add Game</h2>
          {FIELDS.map((field) => (
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
            <Link href={dialogCloseLink.pathname + dialogCloseLink.search}>Cancel</Link>
          </div>
        </dialog>
      </form>
    </>
  );
});
