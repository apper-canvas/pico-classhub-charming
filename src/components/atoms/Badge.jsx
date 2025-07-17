import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ className, variant = "default", children, ...props }, ref) => {
  const variants = {
    default: "bg-secondary-100 text-secondary-800",
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white",
    success: "status-badge status-present",
    warning: "status-badge status-tardy",
    error: "status-badge status-absent",
    secondary: "bg-secondary-200 text-secondary-700",
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;