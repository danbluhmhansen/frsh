import { defineRoute } from "$fresh/server.ts";
import postgres from "postgresjs";
import Trait from "~models/trait.ts";
import Game from "~models/game.ts";

export default defineRoute(async (_, { params: { gameSlug } }) => {
  const sql = postgres();
  const [game] = await sql<Game[]>`SELECT id, name FROM game WHERE slug = ${gameSlug}`;
  const traits = await sql<Trait[]>`SELECT name FROM trait WHERE game_id = ${game.id};`;
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
