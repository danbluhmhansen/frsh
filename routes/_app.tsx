import { defineApp } from "$fresh/server.ts";

export default defineApp((_, { Component }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>frsh</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@unocss/reset/tailwind-compat.min.css" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
});
