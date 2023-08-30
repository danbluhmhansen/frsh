import { defineRoute } from "$fresh/server.ts";
import postgres from "postgresjs";
import { Link } from "~components/Link.tsx";
import { Button } from "~components/Button.tsx";
import { initDialog } from "~utils/utils.ts";
import { Dialog } from "~components/Dialog.tsx";

const PARAM_GEAR = "gear";
const PARAM_TRAITS = "traits";

export default defineRoute(async ({ url }, { params: { gameSlug, actorKindSlug, actorSlug }, renderNotFound }) => {
  const [openGear, closeGear, isGearOpen] = initDialog(url, PARAM_GEAR, [PARAM_TRAITS]);
  const [openTraits, closeTraits, isTraitsOpen] = initDialog(url, PARAM_TRAITS, [PARAM_GEAR]);

  const sql = postgres();
  const [game] = await sql`SELECT name FROM game WHERE slug = ${gameSlug};`;
  const [actorKind] = await sql`SELECT name FROM actor_kind WHERE slug = ${actorKindSlug};`;

  if (!game || !actorKind) return renderNotFound();

  const [actor] = await sql`
    SELECT actor.id, actor.name
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
    WHERE actor.id = ${actor.id};
  `;

  const actorGear = await sql`
    SELECT gear.name, gear.slug, actor_gear.amount
    FROM actor_gear
    JOIN actor on actor.id = actor_gear.actor_id
    JOIN gear on gear.id = actor_gear.gear_id
    WHERE actor.id = ${actor.id};
  `;

  const gears = await sql`
    SELECT gear.name
    FROM gear
    JOIN gear_kind ON gear_kind.id = gear.kind_id
    JOIN game ON game.id = gear_kind.game_id
    WHERE game.slug = ${gameSlug};
  `;

  const actorTraits = await sql`
    SELECT trait.name, trait.slug, actor_trait.amount
    FROM actor_trait
    JOIN actor ON actor.id = actor_trait.actor_id
    JOIN trait ON trait.id = actor_trait.trait_id
    WHERE actor.id = ${actor.id};
  `;

  const traits = await sql`
    SELECT trait.name
    FROM trait
    JOIN game on game.id = trait.game_id
    WHERE game.slug = ${gameSlug} AND trait.slug NOT IN ${sql(actorTraits.map((trait) => trait.slug))};
  `;

  return (
    <>
      <ol class="flex flex-row">
        <li>
          <a href={`/games/${gameSlug}`} class="hover:text-violet">{game.name}</a>
        </li>
        <li class="flex flex-row justify-center items-center">
          <div class="i-tabler-chevron-right" />
        </li>
        <li>
          <a href={`/games/${gameSlug}/actors/${actorKindSlug}`} class="hover:text-violet">
            {actorKind.name}
          </a>
        </li>
      </ol>
      <h1 class="text-3xl font-bold">{actor.name}</h1>
      <table>
        <thead>
          <tr>
            {skills.map((skill) => <th class="p-2 border border-slate-300 dark:border-slate-600">{skill.name}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            {skills.map((skill) => (
              <td class="p-2 border border-slate-300 dark:border-slate-600 text-center">{skill.value}</td>
            ))}
          </tr>
        </tbody>
      </table>
      <h2 class="text-xl font-bold">Gear</h2>
      <form method="post" class="flex flex-col items-center justify-center gap-4">
        <div class="flex flex-row gap-2">
          <Link href={openGear}>
            <div class="i-tabler-plus h-4 w-4" />
          </Link>
          <Button type="submit" name="submit" value="removeGear">
            <div class="i-tabler-trash h-4 w-4" />
          </Button>
        </div>
        <table>
          <thead>
            <tr>
              <th class="p-2 border border-slate-300 dark:border-slate-600"></th>
              <th class="p-2 border border-slate-300 dark:border-slate-600">Name</th>
              <th class="p-2 border border-slate-300 dark:border-slate-600">Amount</th>
            </tr>
          </thead>
          <tbody>
            {actorGear.map((gear) => (
              <tr>
                <td class="p-2 border border-slate-300 dark:border-slate-600">
                  <input type="checkbox" name="slugs" value={gear.slug} class="dark:bg-slate-900 dark:border-white" />
                </td>
                <td class="p-2 border border-slate-300 dark:border-slate-600">{gear.name}</td>
                <td class="p-2 border border-slate-300 dark:border-slate-600">
                  <input
                    type="number"
                    step={1}
                    min={1}
                    pattern="\d+"
                    name={gear.slug}
                    value={gear.amount}
                    class="dark:bg-slate-900 border-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
      <h2 class="text-xl font-bold">Traits</h2>
      <form method="post" class="flex flex-col items-center justify-center gap-4">
        <div class="flex flex-row gap-2">
          <Link href={openTraits}>
            <div class="i-tabler-plus h-4 w-4" />
          </Link>
          <Button type="submit">
            <div class="i-tabler-trash h-4 w-4" />
          </Button>
        </div>
        <table>
          <thead>
            <tr>
              <th class="p-2 border border-slate-300 dark:border-slate-600"></th>
              <th class="p-2 border border-slate-300 dark:border-slate-600">Name</th>
              <th class="p-2 border border-slate-300 dark:border-slate-600">Amount</th>
            </tr>
          </thead>
          <tbody>
            {actorTraits.map((trait) => (
              <tr>
                <td class="p-2 border border-slate-300 dark:border-slate-600">
                  <input type="checkbox" name="slugs" value={trait.slug} class="dark:bg-slate-900 dark:border-white" />
                </td>
                <td class="p-2 border border-slate-300 dark:border-slate-600">{trait.name}</td>
                <td class="p-2 border border-slate-300 dark:border-slate-600">
                  <input
                    type="number"
                    step={1}
                    min={1}
                    pattern="\d+"
                    name={trait.slug}
                    value={trait.amount}
                    class="dark:bg-slate-900 border-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
      {isGearOpen && (
        <Dialog open close={closeGear}>
          <h2 class="text-xl">Add Gear</h2>
          <form method="post" class="flex flex-col justify-center gap-4">
            <table>
              <thead>
                <tr>
                  <th class="p-2 border border-slate-300 dark:border-slate-600"></th>
                  <th class="p-2 border border-slate-300 dark:border-slate-600">Name</th>
                  <th class="p-2 border border-slate-300 dark:border-slate-600">Amount</th>
                </tr>
              </thead>
              <tbody>
                {gears.map((gear) => (
                  <tr>
                    <td class="p-2 border border-slate-300 dark:border-slate-600">
                      <input
                        type="checkbox"
                        name="slugs"
                        value={gear.slug}
                        class="dark:bg-slate-900 dark:border-white"
                      />
                    </td>
                    <td class="p-2 border border-slate-300 dark:border-slate-600">{gear.name}</td>
                    <td class="p-2 border border-slate-300 dark:border-slate-600">
                      <input
                        type="number"
                        step={1}
                        min={1}
                        pattern="\d+"
                        name={gear.slug}
                        class="dark:bg-slate-800 border-none"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div class="flex justify-between">
              <Button type="submit" name="submit" value={PARAM_GEAR}>
                <div class="i-tabler-check h-4 w-4" />
              </Button>
              <Link href={closeGear}>
                <div class="i-tabler-x h-4 w-4" />
              </Link>
            </div>
          </form>
        </Dialog>
      )}
      {isTraitsOpen && (
        <Dialog open close={closeTraits}>
          <h2 class="text-xl">Add Trait</h2>
          <form method="post" class="flex flex-col justify-center gap-4">
            <table>
              <thead>
                <tr>
                  <th class="p-2 border border-slate-300 dark:border-slate-600"></th>
                  <th class="p-2 border border-slate-300 dark:border-slate-600">Name</th>
                  <th class="p-2 border border-slate-300 dark:border-slate-600">Amount</th>
                </tr>
              </thead>
              <tbody>
                {traits.map((trait) => (
                  <tr>
                    <td class="p-2 border border-slate-300 dark:border-slate-600">
                      <input
                        type="checkbox"
                        name="slugs"
                        value={trait.slug}
                        class="dark:bg-slate-900 dark:border-white"
                      />
                    </td>
                    <td class="p-2 border border-slate-300 dark:border-slate-600">{trait.name}</td>
                    <td class="p-2 border border-slate-300 dark:border-slate-600">
                      <input
                        type="number"
                        step={1}
                        min={1}
                        pattern="\d+"
                        name={trait.slug}
                        class="dark:bg-slate-800 border-none"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div class="flex justify-between">
              <Button type="submit" name="submit" value={PARAM_TRAITS}>
                <div class="i-tabler-check h-4 w-4" />
              </Button>
              <Link href={closeTraits}>
                <div class="i-tabler-x h-4 w-4" />
              </Link>
            </div>
          </form>
        </Dialog>
      )}
    </>
  );
});
