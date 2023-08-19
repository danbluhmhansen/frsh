import { defineRoute } from "$fresh/server.ts";
import postgres from "postgresjs";
import Trait from "~models/trait.ts";

export default defineRoute(async (_, { params: { gameName } }) => {
  const sql = postgres();
  const traits = await sql<Trait[]>`
    SELECT trait.id, trait.name FROM trait
    JOIN game ON game.id = trait.game_id
    WHERE game.name = ${gameName};
  `;
  return (
    <>
      {/* @ts-ignore: attributify */}
      <h1 text="3xl" font="bold">{gameName}</h1>
      {/* @ts-ignore: attributify */}
      <h2 text="xl">Traits</h2>
      <ul>
        {traits.map((trait) => <li>{trait.name}</li>)}
      </ul>
    </>
  );
});
