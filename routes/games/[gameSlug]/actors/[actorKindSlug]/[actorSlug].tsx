import { defineRoute } from "$fresh/server.ts";
import postgres from "postgresjs";

export default defineRoute(async (_, { params: { gameSlug, actorKindSlug, actorSlug }, renderNotFound }) => {
  const sql = postgres();
  const [game] = await sql`SELECT name FROM game WHERE slug = ${gameSlug};`;
  const [actorKind] = await sql`SELECT name FROM actor_kind WHERE slug = ${actorKindSlug};`;
  if (!game || !actorKind) return renderNotFound();
  const [actor] = await sql`
    SELECT actor.name
    FROM actor
    JOIN actor_kind ON actor_kind.id = actor.kind_id
    WHERE actor.slug = ${actorSlug} AND actor_kind.slug = ${actorKindSlug};
  `;
  if (!actor) return renderNotFound();
  const skills = await sql`
    SELECT skill.name, actor_num_skill.value
    FROM actor_num_skill
    JOIN actor ON actor.id = actor_num_skill.actor_id
    JOIN actor_kind ON actor_kind.id = actor.kind_id
    JOIN skill ON skill.id = actor_num_skill.skill_id
    WHERE actor.slug = ${actorSlug} AND actor_kind.slug = ${actorKindSlug};
  `;
  return (
    <>
      {/* @ts-ignore: attributify */}
      <ol flex="~ row">
        <li>
          <a href={`/games/${gameSlug}`}>{game.name}</a>
        </li>
        {/* @ts-ignore: attributify */}
        <li flex="~ row" justify="center" items="center">
          <div i-tabler-chevron-right />
        </li>
        <li>
          <a href={`/games/${gameSlug}/actors/${actorKindSlug}`}>{actorKind.name}</a>
        </li>
      </ol>
      {/* @ts-ignore: attributify */}
      <h1 text="3xl" font="bold">{actor.name}</h1>
      <table>
        <thead>
          <tr>
            {skills.map((skill) => <th>{skill.name}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            {skills.map((skill) => <td>{skill.value}</td>)}
          </tr>
        </tbody>
      </table>
    </>
  );
});
