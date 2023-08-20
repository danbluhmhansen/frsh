import { defineRoute } from "$fresh/server.ts";
import postgres from "postgresjs";
import Game from "~models/game.ts";
import Error404 from "~routes/_404.tsx";
import Actor from "~models/actor.ts";
import ActorKind from "~models/actorKind.ts";

interface ActorNumSkill {
  name: string;
  value: number;
}

export default defineRoute(async (_, { params: { gameSlug, actorKindSlug, actorSlug } }) => {
  const sql = postgres();
  const [{ name: gameName }] = await sql<Game[]>`SELECT name FROM game WHERE slug = ${gameSlug};`;
  const [{ name: actorKindName }] = await sql<ActorKind[]>`SELECT name FROM actor_kind WHERE slug = ${actorKindSlug}`;
  if (!gameName || !actorKindName) return <Error404 />;
  const [{ name: actorName }] = await sql<Actor[]>`
    SELECT actor.name
    FROM actor
    JOIN actor_kind ON actor_kind.id = actor.kind_id
    WHERE actor.slug = ${actorSlug} AND actor_kind.slug = ${actorKindSlug}
  `;
  const skills = await sql<ActorNumSkill[]>`
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
          <a href={`/games/${gameSlug}`}>{gameName}</a>
        </li>
        {/* @ts-ignore: attributify */}
        <li flex="~ row" justify="center" items="center">
          <div i-tabler-chevron-right />
        </li>
        <li>
          <a href={`/games/${gameSlug}/actors/${actorKindSlug}`}>{actorKindName}</a>
        </li>
      </ol>
      {/* @ts-ignore: attributify */}
      <h1 text="3xl" font="bold">{actorName}</h1>
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
