import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import { addDays, format, startOfWeek } from "date-fns";
import { toast } from "react-toastify";

const AttendanceGrid = ({ students, attendance, selectedDate, onUpdateAttendance }) => {
  const [selectedWeek, setSelectedWeek] = useState(startOfWeek(selectedDate));

  const weekDates = Array.from({ length: 5 }, (_, i) => addDays(selectedWeek, i));

  const getAttendance = (studentId, date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return attendance.find(a => a.studentId === studentId && a.date === dateStr);
  };

  const handleStatusChange = async (studentId, date, status) => {
    try {
      await onUpdateAttendance(studentId, date, status);
      toast.success("Attendance updated successfully");
    } catch (error) {
      toast.error("Failed to update attendance");
    }
  };

  const markAllPresent = (date) => {
    students.forEach(student => {
      const currentAttendance = getAttendance(student.Id, date);
      if (!currentAttendance || currentAttendance.status !== "present") {
        handleStatusChange(student.Id, format(date, "yyyy-MM-dd"), "present");
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-success-100 text-success-800 border-success-200";
      case "absent":
        return "bg-error-100 text-error-800 border-error-200";
      case "tardy":
        return "bg-warning-100 text-warning-800 border-warning-200";
      default:
        return "bg-secondary-100 text-secondary-600 border-secondary-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedWeek(addDays(selectedWeek, -7))}
          >
            <ApperIcon name="ChevronLeft" className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold text-secondary-900">
            Week of {format(selectedWeek, "MMM d, yyyy")}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedWeek(addDays(selectedWeek, 7))}
          >
            <ApperIcon name="ChevronRight" className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => markAllPresent(selectedDate)}
        >
          <ApperIcon name="CheckCircle" className="h-4 w-4" />
          Mark All Present Today
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50">
              <tr>
                <th className="sticky left-0 z-10 bg-secondary-50 px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Student
                </th>
                {weekDates.map((date) => (
                  <th
                    key={date.toISOString()}
                    className="px-4 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider min-w-[120px]"
                  >
                    <div>
                      <div className="font-semibold">{format(date, "EEE")}</div>
                      <div className="text-xs text-secondary-400">
                        {format(date, "MMM d")}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAllPresent(date)}
                      className="mt-1 text-xs"
                    >
                      All Present
                    </Button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {students.map((student, index) => (
                <motion.tr
                  key={student.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="table-row"
                >
                  <td className="sticky left-0 z-10 bg-white px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {student.firstName[0]}{student.lastName[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-secondary-900">
                          {student.firstName} {student.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  {weekDates.map((date) => {
                    const attendanceRecord = getAttendance(student.Id, date);
                    const status = attendanceRecord?.status || "";
                    
                    return (
                      <td key={date.toISOString()} className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(student.Id, format(date, "yyyy-MM-dd"), "present")}
                            className={`attendance-status p-2 rounded-full ${
                              status === "present" ? "bg-success-100 text-success-600" : "text-secondary-400"
                            }`}
                          >
                            <ApperIcon name="Check" className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(student.Id, format(date, "yyyy-MM-dd"), "absent")}
                            className={`attendance-status p-2 rounded-full ${
                              status === "absent" ? "bg-error-100 text-error-600" : "text-secondary-400"
                            }`}
                          >
                            <ApperIcon name="X" className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(student.Id, format(date, "yyyy-MM-dd"), "tardy")}
                            className={`attendance-status p-2 rounded-full ${
                              status === "tardy" ? "bg-warning-100 text-warning-600" : "text-secondary-400"
                            }`}
                          >
                            <ApperIcon name="Clock" className="h-4 w-4" />
                          </Button>
</div>
                      </td>
                    );
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceGrid;