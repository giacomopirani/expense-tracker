import { format } from "date-fns";
import { it } from "date-fns/locale";
import * as React from "react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type MonthPickerProps = {
  value: Date;
  onChange: (date: Date) => void;
};

export function MonthPicker({ value, onChange }: MonthPickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[240px] justify-start text-left font-normal"
        >
          {value
            ? format(value, "MMMM yyyy", { locale: it })
            : "Seleziona mese"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            if (date) {
              onChange(date);
              setOpen(false);
            }
          }}
          month={value}
          onMonthChange={onChange}
          locale={it}
        />
      </PopoverContent>
    </Popover>
  );
}
