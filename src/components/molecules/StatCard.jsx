import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, icon, trend, trendValue, color = "primary" }) => {
  const colors = {
    primary: "text-primary-600 bg-primary-50",
    success: "text-success-600 bg-success-50",
    warning: "text-warning-600 bg-warning-50",
    error: "text-error-600 bg-error-50",
    secondary: "text-secondary-600 bg-secondary-50",
  };

  return (
    <Card hover className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-secondary-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold gradient-text mb-2`}>{value}</p>
          {trend && (
            <div className="flex items-center gap-1">
              <ApperIcon
                name={trend === "up" ? "TrendingUp" : "TrendingDown"}
                className={`h-4 w-4 ${trend === "up" ? "text-success-500" : "text-error-500"}`}
              />
              <span className={`text-sm font-medium ${trend === "up" ? "text-success-600" : "text-error-600"}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <ApperIcon name={icon} className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;