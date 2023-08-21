import { defineRoute } from "$fresh/server.ts";
import postgres from "postgresjs";

export default defineRoute(async (_, { params: { gameSlug }, renderNotFound }) => {
  const sql = postgres();
  const [game] = await sql`SELECT name FROM game WHERE slug = ${gameSlug};`;
  if (!game) return renderNotFound();
  const actorKinds = await sql`
    SELECT actor_kind.name, actor_kind.slug
    FROM actor_kind
    JOIN game ON game.id = actor_kind.game_id
    WHERE game.slug = ${gameSlug}`;
  return (
    <>
      {/* @ts-ignore: attributify */}
      <h1 text="3xl" font="bold">{game.name}</h1>
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
