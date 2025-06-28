import { Switch } from "@headlessui/react";

export default function ToggleSwitch({ knobSize, gap, translate, title, oncolor, offcolor, enabled, setEnabled }: {
  knobSize: number;
  gap?: number;
  translate?: number;
  title?: string;
  oncolor?: string;
  offcolor?: string;
  enabled: boolean;
  setEnabled: (v: boolean) => void;
}) {
  gap = gap || knobSize * 0.1;
  translate = translate || knobSize * 0.5;
  const outerWidth = knobSize + translate + gap * 2 + 2;

  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      style={{
        width: outerWidth,
        height: knobSize + gap * 2,
        backgroundColor: enabled ? oncolor || "#22c55e" : offcolor || "#ef4444",
        borderRadius: knobSize / 2 + gap,
        padding: gap,
        boxSizing: "border-box",
      }}
      title={title}
      className="relative inline-flex items-center cursor-pointer transition-colors duration-300 focus:outline-none focus-visible:outline-none"
    >
      <span
        style={{
          width: knobSize,
          height: knobSize,
          transform: `translateX(${enabled ? translate : 0}px)`,
        }}
        className="inline-block rounded-full bg-white shadow-md transition-transform duration-300"
      />
    </Switch>
  );
}
