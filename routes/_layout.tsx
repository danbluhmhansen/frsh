import { defineLayout } from "$fresh/server.ts";

export default defineLayout((_, { Component }) => {
  return (
    // @ts-ignore: attributify
    <div min-h="screen" bg="dark:slate-900" text="dark:white">
      {/* @ts-ignore: attributify */}
      <nav p="y-4">
        {/* @ts-ignore: attributify */}
        <ul flex="~ col sm:row" items="center" justify="center" gap="4">
          <li>
            {/* @ts-ignore: attributify */}
            <a href="/" underline="~ hover:violet-300 dark:hover:violet-400">Home</a>
          </li>
          <li>
            {/* @ts-ignore: attributify */}
            <a href="/games" underline="~ hover:violet-300 dark:hover:violet-400">Games</a>
          </li>
        </ul>
      </nav>
      {/* @ts-ignore: attributify */}
      <main container m="x-auto" flex="~ col" items="center" justify="center" gap="4">
        <Component />
      </main>
    </div>
  );
});
