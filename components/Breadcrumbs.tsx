import { JSX, toChildArray } from "preact";

interface Props extends JSX.HTMLAttributes {
  url: URL;
}

export function Breadcrumbs({ children, url }: Props) {
  const segments = url.pathname.substring(1).split("/").map((_, i, s) => `/${s.slice(0, i + 1).join("/")}`).reverse();
  const links = toChildArray(children).reverse().map((child, i) => (
    <>
      {/* @ts-ignore: attributify */}
      <li flex="~ row" justify="center" items="center">
        <a href={segments[i]}>{child}</a>
      </li>
      {/* @ts-ignore: attributify */}
      <li flex="~ row" justify="center" items="center" class="last:hidden">
        <div i-tabler-chevron-right />
      </li>
    </>
  )).reverse();
  return (
    // @ts-ignore: attributify
    <ol flex="~ row" gap="2">
      {links}
    </ol>
  );
}
