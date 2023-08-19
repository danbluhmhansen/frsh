import { LayoutProps } from "$fresh/server.ts";

export default function Layout({ Component }: LayoutProps) {
  return (
    <div class="min-h-screen bg-green-300 dark:bg-green-900 dark:text-white">
      <nav class="py-4">
        {/* @ts-ignore: attributify */}
        <ul flex="~ col sm:row" items="center" justify="center" space="y-4 sm:x-4 sm:y-0">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/games">Games</a>
          </li>
        </ul>
      </nav>
      <main class="container mx-auto flex flex-col items-center justify-center">
        <Component />
      </main>
    </div>
  );
}
