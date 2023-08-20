import { defineRoute } from "$fresh/server.ts";
import postgres from "postgresjs";
import Skill from "~models/skill.ts";
import Game from "~models/game.ts";
import Error404 from "~routes/_404.tsx";

export default defineRoute(async (_, { params: { gameSlug } }) => {
  const sql = postgres();
  const [{ name: gameName }] = await sql<Game[]>`SELECT id, name FROM game WHERE slug = ${gameSlug}`;
  if (!gameName) return <Error404 />;
  const skills = await sql<Skill[]>`
    SELECT skill.name
    FROM skill
    JOIN game ON game.id = skill.game_id
    WHERE game.slug = ${gameSlug};
  `;
  return (
    <>
      {/* @ts-ignore: attributify */}
      <a href={`/games/${gameSlug}`} text="3xl" font="bold">{gameName}</a>
      {/* @ts-ignore: attributify */}
      <h2 text="xl">Skills</h2>
      <ul>
        {skills.map((skill) => <li>{skill.name}</li>)}
      </ul>
    </>
  );
});
