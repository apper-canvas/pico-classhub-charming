import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ className, type = "text", label, error, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={cn(
          "form-input w-full px-3 py-2 border border-secondary-200 rounded-lg bg-white text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200",
          error && "border-error-500 focus:ring-error-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;