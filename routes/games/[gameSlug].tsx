import { defineRoute } from "$fresh/server.ts";
import postgres from "postgresjs";
import Error404 from "~routes/_404.tsx";
import ActorKind from "~models/actorKind.ts";
import Game from "~models/game.ts";

export default defineRoute(async (_, { params: { gameSlug } }) => {
  const sql = postgres();
  const [game] = await sql<Game[]>`SELECT id, name FROM game WHERE slug = ${gameSlug};`;
  if (!game) return <Error404 />;
  const actorKinds = await sql<ActorKind[]>`SELECT name, slug FROM actor_kind WHERE game_id = ${game.id}`;
  return (
    <>
      {/* @ts-ignore: attributify */}
      <h1 text="3xl" font="bold">{game.name}</h1>
      <ul>
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
