import { defineRoute } from "$fresh/server.ts";
import postgres from "postgresjs";
import ActorKind from "~models/actorKind.ts";
import Game from "~models/game.ts";
import Error404 from "~routes/_404.tsx";

export default defineRoute(async (_, { params: { gameSlug } }) => {
  const sql = postgres();
  const [{ name: gameName }] = await sql<Game[]>`SELECT name FROM game WHERE slug = ${gameSlug};`;
  if (!gameName) return <Error404 />;
  const actorKinds = await sql<ActorKind[]>`
    SELECT actor_kind.name, actor_kind.slug
    FROM actor_kind
    JOIN game ON game.id = actor_kind.game_id
    WHERE game.slug = ${gameSlug}`;
  return (
    <>
      {/* @ts-ignore: attributify */}
      <h1 text="3xl" font="bold">{gameName}</h1>
      {/* @ts-ignore: attributify */}
      <ul flex="~ row" gap="4">
        <li>
          <h2>Actors</h2>
          <ul>
            {actorKinds.map((actorKind) => (
              <li>
                <a href={`/games/${gameSlug}/actors/${actorKind.slug}`}>{actorKind.name}</a>
              </li>
            ))}
          </ul>
        </li>
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
