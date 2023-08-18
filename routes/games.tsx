import postgrestRequest from "~lib/postgrest-request.ts";
import { defineRoute } from "$fresh/server.ts";

interface Game {
  id: string;
  name: string;
}

export default defineRoute(async (req, ctx) => {
  const games: Game[] = await postgrestRequest().path("game").json();
  return (
    <>
      <h1 class="text-4xl font-bold">Games</h1>
      <ul>
        {games.map((game) => <li>{game.name}</li>)}
      </ul>
    </>
  );
});
