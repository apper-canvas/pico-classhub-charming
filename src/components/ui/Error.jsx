import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message, onRetry, title = "Something went wrong" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm border border-error-200"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-error-500 to-error-600 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">{title}</h3>
      <p className="text-secondary-600 text-center mb-6 max-w-md">
        {message || "We encountered an error while loading the data. Please try again."}
      </p>
      <div className="flex items-center gap-3">
        <Button
          variant="error"
          onClick={onRetry}
          className="flex items-center gap-2"
        >
          <ApperIcon name="RotateCcw" className="h-4 w-4" />
          Try Again
        </Button>
        <Button
          variant="secondary"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </Button>
      </div>
    </motion.div>
  );
};

export default Error;