import { Square } from "lucide-react";
import { HslColor, HslColorPicker } from "react-colorful";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { hslToCssString } from ".";

interface ColorPickerProps {
  color: HslColor;
  setColor: (color: HslColor) => void;
}

export function ColorPicker({ color, setColor }: ColorPickerProps) {
  return (
    <Popover modal={true}>
      <PopoverTrigger>
        <Square fill={`hsl(${hslToCssString(color)})`} color="none" size={24} />
      </PopoverTrigger>
      <PopoverContent className="w-80 z-[55]">
        <HslColorPicker color={color} onChange={setColor} />
      </PopoverContent>
    </Popover>
  );
}
