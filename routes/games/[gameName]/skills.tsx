import { defineRoute } from "$fresh/server.ts";
import postgres from "postgresjs";
import Skill from "~models/skill.ts";

export default defineRoute(async (_, { params: { gameName } }) => {
  const sql = postgres();
  const skills = await sql<Skill[]>`
    SELECT skill.id, skill.name FROM skill
    JOIN game ON game.id = skill.game_id
    WHERE game.name = ${gameName};
  `;
  return (
    <>
      {/* @ts-ignore: attributify */}
      <h1 text="3xl" font="bold">{gameName}</h1>
      {/* @ts-ignore: attributify */}
      <h2 text="xl">Skills</h2>
      <ul>
        {skills.map((skill) => <li>{skill.name}</li>)}
      </ul>
    </>
  );
});
