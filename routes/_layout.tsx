import { defineLayout } from "$fresh/server.ts";

export default defineLayout((_, ctx) => {
  return (
    // @ts-ignore: attributify
    <div min-h="screen" bg="slate-300 dark:slate-900" text="dark:white">
      {/* @ts-ignore: attributify */}
      <nav p="y-4">
        {/* @ts-ignore: attributify */}
        <ul flex="~ col sm:row" items="center" justify="center" gap="4">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/games">Games</a>
          </li>
        </ul>
      </nav>
      {/* @ts-ignore: attributify */}
      <main container m="x-auto" flex="~ col" items="center" justify="center" gap="4">
        <ctx.Component />
      </main>
    </div>
  );
});
