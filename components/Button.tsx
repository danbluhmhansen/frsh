import { JSX } from "preact";

interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  color?: "violet" | "green" | "yellow" | "red";
}

export function Button(props: ButtonProps) {
  props.color ??= "violet";

  let bg = "";
  let border = "";
  let ring = "";
  let text = "";

  switch (props.color) {
    case "violet":
      bg = "hover:violet-500 dark:hover:violet-400";
      border = "violet-600 dark:violet-300";
      ring = "focus:violet-400 dark:focus:violet-500";
      text = "violet-600 dark:violet-300";
      break;
    case "green":
      bg = "hover:green-500 dark:hover:green-400";
      border = "green-600 dark:green-300";
      ring = "focus:green-400 dark:focus:green-500";
      text = "green-600 dark:green-300";
      break;
    case "yellow":
      bg = "hover:yellow-500 dark:hover:yellow-400";
      border = "yellow-600 dark:yellow-300";
      ring = "focus:yellow-400 dark:focus:yellow-500";
      text = "yellow-600 dark:yellow-300";
      break;
    case "red":
      bg = "hover:red-500 dark:hover:red-400";
      border = "red-600 dark:red-300";
      ring = "focus:red-400 dark:focus:red-500";
      text = "red-600 dark:red-300";
      break;
  }

  return (
    <button
      {...props}
      // @ts-ignore: attributify
      bg={`transparent ${bg}`}
      border={`~ ${border}`}
      font="medium"
      outline="focus:none"
      p="x-4 y-2"
      ring={`focus:4 ${ring}`}
      rounded=""
      text={`sm center hover:white ${text}`}
    />
  );
}
