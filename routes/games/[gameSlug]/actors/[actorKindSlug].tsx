import { defineRoute } from "$fresh/server.ts";
import postgres from "postgresjs";

export default defineRoute(async (_, { params: { gameSlug, actorKindSlug }, renderNotFound }) => {
  const sql = postgres();
  const [game] = await sql`SELECT name FROM game WHERE slug = ${gameSlug};`;
  if (!game) return renderNotFound();
  const [{ exists }] = await sql`SELECT EXISTS(SELECT 1 FROM actor_kind WHERE slug = ${actorKindSlug});`;
  if (!exists) return renderNotFound();
  const actors = await sql`
    SELECT actor.name, actor.slug
    FROM actor
    JOIN actor_kind ON actor_kind.id = actor.kind_id
    WHERE actor_kind.slug = ${actorKindSlug};
  `;
  return (
    <>
      {/* @ts-ignore: attributify */}
      <a href={`/games/${gameSlug}`} text="3xl" font="bold" underline="~ hover:violet-300 dark:hover:violet-400">
        {game.name}
      </a>
      <ul>
        {actors.map((actor) => (
          <li>
            <a
              href={`/games/${gameSlug}/actors/${actorKindSlug}/${actor.slug}`}
              // @ts-ignore: attributify
              underline="~ hover:violet-300 dark:hover:violet-400"
            >
              {actor.name}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
});
