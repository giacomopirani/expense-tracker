import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
      <motion.div
        className="w-12 h-12 border-4 border-stone-700 border-t-transparent rounded-full animate-spin"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};

export default Loader;
