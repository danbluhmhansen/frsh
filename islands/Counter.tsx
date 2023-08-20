import type { Signal } from "@preact/signals";
import { Button } from "~components/Button.tsx";

interface CounterProps {
  count: Signal<number>;
}

export default function Counter(props: CounterProps) {
  return (
    // @ts-ignore: attributify
    <div flex="~ row" gap="8" p="y-6">
      <Button onClick={() => props.count.value -= 1}>-1</Button>
      {/* @ts-ignore: attributify */}
      <p text="3xl">{props.count}</p>
      <Button onClick={() => props.count.value += 1}>+1</Button>
    </div>
  );
}
