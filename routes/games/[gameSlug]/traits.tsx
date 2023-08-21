import { defineRoute } from "$fresh/server.ts";
import postgres from "postgresjs";

export default defineRoute(async (_, { params: { gameSlug }, renderNotFound }) => {
  const sql = postgres();
  const [game] = await sql`SELECT name FROM game WHERE slug = ${gameSlug};`;
  if (!game) return renderNotFound();
  const traits = await sql`
    SELECT trait.name
    FROM trait
    JOIN game ON game.id = trait.game_id
    WHERE game.slug = ${gameSlug};
  `;
  return (
    <>
      {/* @ts-ignore: attributify */}
      <a href={`/games/${gameSlug}`} text="3xl" font="bold">{game.name}</a>
      {/* @ts-ignore: attributify */}
      <h1 text="xl">Traits</h1>
      <ul>
        {traits.map((trait) => <li>{trait.name}</li>)}
      </ul>
    </>
  );
});
