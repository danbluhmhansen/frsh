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
      <a href={`/games/${gameSlug}`} class="text-3xl hover:text-violet font-bold">
        {game.name}
      </a>
      <h1 class="text-xl">Traits</h1>
      <ul>
        {traits.map((trait) => <li>{trait.name}</li>)}
      </ul>
    </>
  );
});
