import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const EmployeesTable = ({ employees, onEdit, onDelete, onView }) => {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "hireDate") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <ApperIcon name="ArrowUpDown" className="h-4 w-4 text-secondary-400" />;
    }
    return sortDirection === "asc" ? (
      <ApperIcon name="ArrowUp" className="h-4 w-4 text-primary-600" />
    ) : (
      <ApperIcon name="ArrowDown" className="h-4 w-4 text-primary-600" />
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      case "on_leave":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      case "on_leave":
        return "On Leave";
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50 border-b border-secondary-200">
            <tr>
              <th className="text-left p-4 font-semibold text-secondary-900">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-2 hover:text-primary-600 transition-colors"
                >
                  Name
                  <SortIcon field="name" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-secondary-900">
                <button
                  onClick={() => handleSort("department")}
                  className="flex items-center gap-2 hover:text-primary-600 transition-colors"
                >
                  Department
                  <SortIcon field="department" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-secondary-900">
                <button
                  onClick={() => handleSort("position")}
                  className="flex items-center gap-2 hover:text-primary-600 transition-colors"
                >
                  Position
                  <SortIcon field="position" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-secondary-900">Email</th>
              <th className="text-left p-4 font-semibold text-secondary-900">
                <button
                  onClick={() => handleSort("hireDate")}
                  className="flex items-center gap-2 hover:text-primary-600 transition-colors"
                >
                  Hire Date
                  <SortIcon field="hireDate" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-secondary-900">
                <button
                  onClick={() => handleSort("status")}
                  className="flex items-center gap-2 hover:text-primary-600 transition-colors"
                >
                  Status
                  <SortIcon field="status" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-secondary-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedEmployees.map((employee, index) => (
              <motion.tr
                key={employee.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="table-row border-b border-secondary-100 hover:bg-secondary-50"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {employee.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-secondary-900">{employee.name}</div>
                      <div className="text-sm text-secondary-600">{employee.employeeId}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-secondary-900">{employee.department}</td>
                <td className="p-4 text-secondary-900">{employee.position}</td>
                <td className="p-4 text-secondary-600">{employee.email}</td>
                <td className="p-4 text-secondary-600">
                  {format(new Date(employee.hireDate), "MMM d, yyyy")}
                </td>
                <td className="p-4">
                  <StatusBadge
                    status={getStatusText(employee.status)}
                    variant={getStatusColor(employee.status)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(employee)}
                      title="View Employee"
                    >
                      <ApperIcon name="Eye" className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(employee)}
                      title="Edit Employee"
                    >
                      <ApperIcon name="Edit" className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(employee.Id)}
                      title="Delete Employee"
                      className="text-error-600 hover:text-error-700"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeesTable;