import { LayoutProps } from "$fresh/server.ts";

export default function Layout({ Component }: LayoutProps) {
  return (
    // @ts-ignore: attributify
    <div min-h="screen" bg="green-300 dark:green-900" text="dark:white">
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
      <main container m="x-auto" flex="~ col" items="center" justify="center">
        <Component />
      </main>
    </div>
  );
}
