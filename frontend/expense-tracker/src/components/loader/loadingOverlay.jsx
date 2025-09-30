import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const LoadingOverlay = ({ isVisible, message = "Caricamento in corso..." }) => {
  const [dots, setDots] = useState("");
  const [encouragementIndex, setEncouragementIndex] = useState(0);

  const encouragements = [
    "Stiamo preparando tutto per te...",
    "Ancora un momento...",
    "Quasi pronto!",
    "Caricamento dei tuoi dati...",
    "Autenticazione in corso...",
  ];

  useEffect(() => {
    if (!isVisible) return;

    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    const messageInterval = setInterval(() => {
      setEncouragementIndex((prev) => (prev + 1) % encouragements.length);
    }, 4000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(messageInterval);
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md"
        >
          {/* Spinner */}
          <motion.div
            className="w-20 h-20 border-4 border-white/10 border-t-stone-500 rounded-full mb-6"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />

          {/* Messaggio principale */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-white text-xl font-semibold mb-3 text-center"
          >
            {message}
          </motion.div>

          <motion.div
            key={encouragementIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.4 }}
            className="text-sm text-white/70 text-center min-h-[20px]"
          >
            {encouragements[encouragementIndex]}
            {dots}
          </motion.div>

          {/* Barra di progresso */}
          <div className="w-52 h-[3px] bg-white/10 rounded mt-6 overflow-hidden">
            <motion.div
              className="h-full bg-stone-500"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;
