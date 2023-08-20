import { defineRoute } from "$fresh/server.ts";
import postgres from "postgresjs";
import Actor from "~models/actor.ts";
import ActorKind from "~models/actorKind.ts";

export default defineRoute(async (_, { params: { gameSlug, actorKindSlug } }) => {
  const sql = postgres();
  const [actorKind] = await sql<ActorKind[]>`SELECT id, name FROM actor_kind WHERE slug = ${actorKindSlug}`;
  const actors = await sql<Actor[]>`SELECT name, slug FROM actor WHERE kind_id = ${actorKind.id}`;
  return (
    <>
      {/* @ts-ignore: attributify */}
      <a href={`/games/${gameSlug}/actors/${actorKindSlug}`} text="3xl" font="bold">{actorKind.name}</a>
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
