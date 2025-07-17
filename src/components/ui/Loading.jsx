import { motion } from "framer-motion";

const Loading = ({ type = "table" }) => {
  const shimmerClass = "shimmer bg-secondary-200 rounded animate-pulse";

  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6"
          >
            <div className="space-y-4">
              <div className={`${shimmerClass} h-6 w-3/4`} />
              <div className={`${shimmerClass} h-4 w-1/2`} />
              <div className="flex items-center gap-4">
                <div className={`${shimmerClass} h-4 w-16`} />
                <div className={`${shimmerClass} h-4 w-20`} />
              </div>
              <div className="flex items-center gap-2 pt-4">
                <div className={`${shimmerClass} h-8 flex-1`} />
                <div className={`${shimmerClass} h-8 flex-1`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "stats") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className={`${shimmerClass} h-4 w-24 mb-2`} />
                <div className={`${shimmerClass} h-8 w-16 mb-2`} />
                <div className={`${shimmerClass} h-3 w-20`} />
              </div>
              <div className={`${shimmerClass} h-12 w-12 rounded-lg`} />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Default table loading
  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200 overflow-hidden">
      <div className="p-4 border-b border-secondary-200">
        <div className={`${shimmerClass} h-4 w-32`} />
      </div>
      <div className="divide-y divide-secondary-200">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 flex items-center space-x-4"
          >
            <div className={`${shimmerClass} h-10 w-10 rounded-full`} />
            <div className="flex-1 space-y-2">
              <div className={`${shimmerClass} h-4 w-3/4`} />
              <div className={`${shimmerClass} h-3 w-1/2`} />
            </div>
            <div className={`${shimmerClass} h-6 w-16 rounded-full`} />
            <div className="flex space-x-2">
              <div className={`${shimmerClass} h-8 w-8 rounded`} />
              <div className={`${shimmerClass} h-8 w-8 rounded`} />
              <div className={`${shimmerClass} h-8 w-8 rounded`} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Loading;