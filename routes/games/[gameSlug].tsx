import { defineRoute } from "$fresh/server.ts";
import postgres from "postgresjs";
import Error404 from "~routes/_404.tsx";
import Game from "~models/game.ts";

export default defineRoute(async (_, { params: { gameSlug } }) => {
  const sql = postgres();
  const [game] = await sql<Game[]>`SELECT name FROM game WHERE slug = ${gameSlug};`;
  if (!game) return <Error404 />;
  return (
    <>
      {/* @ts-ignore: attributify */}
      <h1 text="3xl" font="bold">{game.name}</h1>
      <ul>
        <li>
          <a href={`/games/${gameSlug}/skills`}>Skills</a>
        </li>
        <li>
          <a href={`/games/${gameSlug}/traits`}>Traits</a>
        </li>
      </ul>
    </>
  );
});
