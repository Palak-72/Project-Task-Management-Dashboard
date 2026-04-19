import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center p-10 space-y-4">
      {}
      <div className="relative w-12 h-12">
        {}
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        
        {}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
          className="absolute inset-0 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full"
        />
      </div>

      {}
      <motion.p
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 0.8,
        }}
        className="text-sm font-medium text-gray-600 tracking-wide"
      >
        Loading dashboard...
      </motion.p>
    </div>
  );
}