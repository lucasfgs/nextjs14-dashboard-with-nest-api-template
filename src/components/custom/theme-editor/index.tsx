import { HslColor } from "react-colorful";
import { useEffect, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

import { ColorPicker } from "./color-picker";

// Utility function to convert HSL color object to CSS-compatible string
export const hslToCssString = (hsl: HslColor) => {
  return `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;
};

export function ThemeEditor() {
  const [primaryColor, setPrimaryColor] = useState<HslColor>({
    h: 0,
    s: 0,
    l: 50,
  });

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--primary",
      hslToCssString(primaryColor)
    );
  }, [primaryColor]);

  return (
    <div className="absolute right-0 top-[50%] translate-y-[-50%]">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="w-6 h-24 " variant={"default"}>
            <span className="-rotate-90">Customize</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[360px] flex flex-col">
          <SheetHeader>
            <SheetTitle>Theme editor</SheetTitle>
          </SheetHeader>
          <Accordion type="single" collapsible className="w-full flex-1">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg">Colors</AccordionTrigger>
              <AccordionContent className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <Label className="text-muted-foreground mr-2">Primary:</Label>
                  <ColorPicker
                    color={primaryColor}
                    setColor={setPrimaryColor}
                  />
                </div>
                <div className="flex items-center">
                  <Label className="text-muted-foreground mr-2">
                    Secondary:
                  </Label>
                  <ColorPicker
                    color={primaryColor}
                    setColor={setPrimaryColor}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
