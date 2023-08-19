import { defineRoute } from "$fresh/server.ts";
import postgres from "postgresjs";
import Error404 from "~routes/_404.tsx";
import Game from "~models/game.ts";

export default defineRoute(async (_, { params: { gameName } }) => {
  const sql = postgres();
  const [game] = await sql<Game[]>`SELECT id, name FROM game WHERE name = ${gameName};`;
  if (!game) return <Error404 />;
  return (
    <>
      {/* @ts-ignore: attributify */}
      <h1 text="3xl" font="bold">{gameName}</h1>
      <ul>
        <li>
          <a href={`/games/${gameName}/skills`}>Skills</a>
        </li>
        <li>
          <a href={`/games/${gameName}/traits`}>Traits</a>
        </li>
      </ul>
    </>
  );
});
