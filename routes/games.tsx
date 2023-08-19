import { defineRoute } from "$fresh/server.ts";
import postgres from "postgresjs";
import Game from "~models/game.ts";

export default defineRoute(async () => {
  const sql = postgres();
  const games = await sql<Game[]>`SELECT id, name FROM game;`;
  return (
    <>
      {/* @ts-ignore: attributify */}
      <h1 text="3xl" font="bold">Games</h1>
      <ul>
        {games.map((game) => <li><a href={`/games/${game.name}`}>{game.name}</a></li>)}
      </ul>
    </>
  );
});
