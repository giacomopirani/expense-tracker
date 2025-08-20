import { zodResolver } from "@hookform/resolvers/zod";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import {
  loginSchema,
  type LoginFormValues,
} from "../lib/services/auth-schemas";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);
    // Simula una chiamata API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (values.email === "test@example.com" && values.password === "password") {
      navigate("/dashboard"); // Reindirizza alla dashboard dopo il login
    } else {
      setError("Email o password non validi.");
    }
    setLoading(false);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const formItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-700 p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="w-full max-w-md"
      >
        <Card className="bg-stone-50 text-stone-800 border-stone-600">
          <CardHeader className="space-y-1">
            <img
              src="/src/assets/logo.png"
              alt="App Logo"
              className="h-20 w-20 rounded-full border-2 border-stone-500 mx-auto"
            />
            <CardTitle className="text-2xl text-center">Accedi</CardTitle>
            <CardDescription className="text-center text-stone-700">
              Inserisci le tue credenziali per accedere
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4"
              >
                <motion.div variants={formItemVariants}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-stone-800">Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="mario.rossi@example.com"
                            {...field}
                            className="bg-stone-500 border-stone-500 text-white placeholder:text-stone-300 focus:ring-stone-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                <motion.div variants={formItemVariants}>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-stone-800">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="********"
                              {...field}
                              className="bg-stone-600 border-stone-500 text-white  placeholder:text-stone-300 focus:ring-stone-400 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-white  hover:text-stone-100 transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm text-center"
                  >
                    {error}
                  </motion.p>
                )}
                <motion.div variants={formItemVariants}>
                  <Button
                    type="submit"
                    className="w-full bg-stone-500 hover:bg-stone-600 text-white"
                    disabled={loading}
                  >
                    {loading ? "Accesso in corso..." : "Accedi"}
                  </Button>
                </motion.div>
              </form>
            </Form>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4 text-center text-sm text-stone-900"
            >
              Non sei registrato?{" "}
              <Link
                to="/register"
                className="underline text-stone-800 hover:text-stone-500"
              >
                Registrati
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
