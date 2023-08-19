import { defineRoute } from "$fresh/server.ts";
import postgres from "postgresjs";
import Skill from "~models/skill.ts";
import Game from "~models/game.ts";

export default defineRoute(async (_, { params: { gameSlug } }) => {
  const sql = postgres();
  const [game] = await sql<Game[]>`SELECT id, name FROM game WHERE slug = ${gameSlug}`;
  const skills = await sql<Skill[]>`SELECT name FROM skill WHERE game_id = ${game.id};`;
  return (
    <>
      {/* @ts-ignore: attributify */}
      <a href={`/games/${gameSlug}`} text="3xl" font="bold">{game.name}</a>
      {/* @ts-ignore: attributify */}
      <h2 text="xl">Skills</h2>
      <ul>
        {skills.map((skill) => <li>{skill.name}</li>)}
      </ul>
    </>
  );
});
