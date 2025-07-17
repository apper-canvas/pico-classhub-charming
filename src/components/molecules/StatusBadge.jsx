import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status, className }) => {
  const statusConfig = {
    present: { variant: "success", label: "Present" },
    absent: { variant: "error", label: "Absent" },
    tardy: { variant: "warning", label: "Tardy" },
    active: { variant: "success", label: "Active" },
    inactive: { variant: "error", label: "Inactive" },
    pending: { variant: "warning", label: "Pending" },
  };

  const config = statusConfig[status] || { variant: "default", label: status };

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;