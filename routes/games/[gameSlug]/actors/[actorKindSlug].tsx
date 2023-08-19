import { defineRoute } from "$fresh/server.ts";
import postgres from "postgresjs";
import Actor from "~models/actor.ts";
import ActorKind from "~models/actorKind.ts";
import { Breadcrumbs } from "~components/Breadcrumbs.tsx";
import Game from "~models/game.ts";

export default defineRoute(async (_, { params: { gameSlug, actorKindSlug }, url }) => {
  const sql = postgres();
  const [game] = await sql<Game[]>`SELECT name FROM game WHERE slug = ${gameSlug}`;
  const [actorKind] = await sql<ActorKind[]>`SELECT id, name FROM actor_kind WHERE slug = ${actorKindSlug}`;
  const actors = await sql<Actor[]>`SELECT name, slug FROM actor WHERE kind_id = ${actorKind.id}`;
  return (
    <>
      <Breadcrumbs url={url}>
        <span>{game.name}</span>
        <span>Actors</span>
      </Breadcrumbs>
      {/* @ts-ignore: attributify */}
      <h2 text="xl">Actors</h2>
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
