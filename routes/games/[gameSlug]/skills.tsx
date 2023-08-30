import { defineRoute } from "$fresh/server.ts";
import postgres from "postgresjs";

export default defineRoute(async (_, { params: { gameSlug }, renderNotFound }) => {
  const sql = postgres();
  const [game] = await sql`SELECT name FROM game WHERE slug = ${gameSlug};`;
  if (!game) return renderNotFound();
  const skills = await sql`
    SELECT skill.name
    FROM skill
    JOIN game ON game.id = skill.game_id
    WHERE game.slug = ${gameSlug};
  `;
  return (
    <>
      <a href={`/games/${gameSlug}`} class="text-3xl hover:text-violet font-bold">
        {game.name}
      </a>
      <h2 class="text-xl">Skills</h2>
      <ul>
        {skills.map((skill) => <li>{skill.name}</li>)}
      </ul>
    </>
  );
});
