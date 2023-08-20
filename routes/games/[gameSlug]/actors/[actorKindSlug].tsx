import { defineRoute } from "$fresh/server.ts";
import postgres from "postgresjs";
import Actor from "~models/actor.ts";
import Game from "~models/game.ts";
import Error404 from "~routes/_404.tsx";

export default defineRoute(async (_, { params: { gameSlug, actorKindSlug } }) => {
  const sql = postgres();
  const [{ name: gameName }] = await sql<Game[]>`SELECT id, name FROM game WHERE slug = ${gameSlug}`;
  if (!gameName) return <Error404 />;
  const actors = await sql<Actor[]>`
    SELECT actor.name, actor.slug
    FROM actor
    JOIN actor_kind ON actor_kind.id = actor.kind_id
    WHERE actor_kind.slug = ${actorKindSlug}
  `;
  return (
    <>
      {/* @ts-ignore: attributify */}
      <a href={`/games/${gameSlug}`} text="3xl" font="bold">{gameName}</a>
      <ul>
        {actors.map((actor) => (
          <li>
            <a href={`/games/${gameSlug}/actors/${actorKindSlug}/${actor.slug}`}>{actor.name}</a>
          </li>
        ))}
      </ul>
    </>
  );
});
