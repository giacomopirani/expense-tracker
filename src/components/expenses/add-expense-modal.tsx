import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, ShoppingCartIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import type { ExpenseFormValues } from "../../lib/validation";
import { expenseSchema } from "../../lib/validation";
import { useExpenseStore } from "../../store/use-expense-store";
import type { CreateExpense } from "../../types/expense";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const categories = [
  "Alimentari",
  "Trasporti",
  "Casa",
  "Intrattenimento",
  "Salute",
  "Istruzione",
  "Altro",
];

export function AddExpenseModal() {
  const [isOpen, setIsOpen] = useState(false);
  const addExpense = useExpenseStore((state) => state.addExpense);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: "",
      amount: 0,
      category: "",
      date: new Date(),
    },
  });

  const onSubmit = (values: ExpenseFormValues) => {
    const newExpense: CreateExpense = {
      description: values.description,
      amount: values.amount,
      category: values.category,
      date: format(values.date, "yyyy-MM-dd"),
    };

    addExpense(newExpense);
    form.reset();
    setIsOpen(false);
    console.log("Spesa aggiunta:", newExpense);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-stone-700 border-2 py-5 border-stone-400 hover:bg-stone-500">
          <ShoppingCartIcon className="h-8 w-8" />
          Aggiungi spesa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Aggiungi Nuova Spesa</DialogTitle>
          <DialogDescription>
            Compila i campi per registrare una nuova spesa.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <motion.form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrizione</FormLabel>
                    <FormControl>
                      <Input placeholder="Es. Caffè al bar" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Importo</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? ""
                              : parseFloat(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona una categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Seleziona una data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                className="w-full mt-4 bg-stone-700 hover:bg-stone-500"
              >
                Salva Spesa
              </Button>
            </motion.div>
          </motion.form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
