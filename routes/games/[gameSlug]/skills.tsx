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
      {/* @ts-ignore: attributify */}
      <a href={`/games/${gameSlug}`} text="3xl hover:violet" font="bold">
        {game.name}
      </a>
      {/* @ts-ignore: attributify */}
      <h2 text="xl">Skills</h2>
      <ul>
        {skills.map((skill) => <li>{skill.name}</li>)}
      </ul>
    </>
  );
});
