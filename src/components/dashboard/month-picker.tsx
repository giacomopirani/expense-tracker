import { format } from "date-fns";
import { it } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type MonthPickerProps = {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
};

export function MonthPicker({
  value,
  onChange,
  placeholder = "Seleziona mese",
  className,
}: MonthPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [currentYear, setCurrentYear] = React.useState(
    value?.getFullYear() || new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = React.useState<number | null>(null);

  const months = [
    "Gen",
    "Feb",
    "Mar",
    "Apr",
    "Mag",
    "Giu",
    "Lug",
    "Ago",
    "Set",
    "Ott",
    "Nov",
    "Dic",
  ];

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(currentYear, monthIndex, 1);
    onChange(newDate);

    // Set selected month for visual feedback
    setSelectedMonth(monthIndex);

    // Close popover with a slight delay for better UX
    setTimeout(() => {
      setOpen(false);
      setSelectedMonth(null);
    }, 500);
  };

  const navigateYear = (direction: "prev" | "next") => {
    setCurrentYear((prev) => (direction === "prev" ? prev - 1 : prev + 1));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-10 w-[150px] justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className=" h-4 w-4" />
          {value ? format(value, "MMM yyyy", { locale: it }) : placeholder}
        </Button>
      </PopoverTrigger>
      <AnimatePresence>
        {open && (
          <PopoverContent
            className="w-64 mr-16 p-3 shadow-2xl border-2"
            align="start"
            side="bottom"
            asChild
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
                y: -20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                y: -20,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.3,
              }}
            >
              <motion.div
                className="flex items-center justify-between mb-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 bg-transparent"
                  onClick={() => navigateYear("prev")}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <div className="font-semibold text-sm">{currentYear}</div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 bg-transparent"
                  onClick={() => navigateYear("next")}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </motion.div>

              <motion.div
                className="grid grid-cols-3 gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                {months.map((month, index) => {
                  const isSelected =
                    value &&
                    value.getMonth() === index &&
                    value.getFullYear() === currentYear;

                  const isCurrentlySelected = selectedMonth === index;

                  return (
                    <motion.div
                      key={month}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 0.2 + index * 0.03,
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={isSelected ? "default" : "ghost"}
                        size="sm"
                        className={cn(
                          "h-8 text-xs font-medium w-full transition-all duration-200",
                          isCurrentlySelected &&
                            "bg-black text-white hover:bg-black/90"
                        )}
                        onClick={() => handleMonthSelect(index)}
                      >
                        {month}
                      </Button>
                    </motion.div>
                  );
                })}
              </motion.div>

              {value && (
                <motion.div
                  className="mt-3 pt-2 border-t"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-7 text-xs text-muted-foreground"
                    onClick={() => {
                      onChange(null);
                      setOpen(false);
                    }}
                  >
                    Cancella selezione
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </PopoverContent>
        )}
      </AnimatePresence>
    </Popover>
  );
}
