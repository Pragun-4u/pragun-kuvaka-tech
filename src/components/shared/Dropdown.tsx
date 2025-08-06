"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type Option = {
  label: string;
  value: string;
};

type ComboBoxProps = {
  options: Option[];
  placeholder: string;
  onChange?: (value: string) => void;
};

export default function Dropdown({
  options,
  placeholder,
  onChange,
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Option | null>(null);

  const handleSelect = (option: Option) => {
    setSelected(option);
    onChange?.(option.value);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selected ? selected.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0" align="start" side="bottom">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No result found.</CommandEmpty>
          <CommandGroup>
            {options.map((option, index) => (
              <CommandItem
                key={option.value + option.label + index}
                value={option.label.toLowerCase()}
                onSelect={(currentValue) => {
                  const selectedOption = options.find(
                    (opt) =>
                      opt.label.toLowerCase() === currentValue.toLowerCase()
                  );
                  if (selectedOption) handleSelect(selectedOption);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selected?.value === option.value
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
