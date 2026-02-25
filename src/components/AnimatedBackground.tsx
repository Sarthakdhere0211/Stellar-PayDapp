import { motion } from 'framer-motion';

export const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        className="absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-cyan-500/20 blur-3xl"
      />
    </div>
  );
};
