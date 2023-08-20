import { defineRoute } from "$fresh/server.ts";
import postgres from "postgresjs";
import Trait from "~models/trait.ts";
import Game from "~models/game.ts";
import Error404 from "~routes/_404.tsx";

export default defineRoute(async (_, { params: { gameSlug } }) => {
  const sql = postgres();
  const [{ name: gameName }] = await sql<Game[]>`SELECT id, name FROM game WHERE slug = ${gameSlug}`;
  if (!gameName) return <Error404 />;
  const traits = await sql<Trait[]>`
    SELECT trait.name
    FROM trait
    JOIN game ON game.id = trait.game_id
    WHERE game.slug = ${gameSlug};
  `;
  return (
    <>
      {/* @ts-ignore: attributify */}
      <a href={`/games/${gameSlug}`} text="3xl" font="bold">{gameName}</a>
      {/* @ts-ignore: attributify */}
      <h1 text="xl">Traits</h1>
      <ul>
        {traits.map((trait) => <li>{trait.name}</li>)}
      </ul>
    </>
  );
});
