import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const GradesGrid = ({ students, assignments, grades, onUpdateGrade }) => {
  const [editingCell, setEditingCell] = useState(null);
  const [tempValue, setTempValue] = useState("");

  const getGrade = (studentId, assignmentId) => {
    const grade = grades.find(g => g.studentId === studentId && g.assignmentId === assignmentId);
    return grade ? grade.score : "";
  };

  const handleCellClick = (studentId, assignmentId, currentValue) => {
    setEditingCell({ studentId, assignmentId });
    setTempValue(currentValue.toString());
  };

  const handleCellSave = async (studentId, assignmentId) => {
    const score = parseFloat(tempValue);
    const assignment = assignments.find(a => a.Id === assignmentId);
    
    if (isNaN(score) || score < 0 || score > assignment.points) {
      toast.error(`Score must be between 0 and ${assignment.points}`);
      return;
    }

    try {
      await onUpdateGrade(studentId, assignmentId, score);
      setEditingCell(null);
      setTempValue("");
      toast.success("Grade updated successfully");
    } catch (error) {
      toast.error("Failed to update grade");
    }
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setTempValue("");
  };

  const handleKeyDown = (e, studentId, assignmentId) => {
    if (e.key === "Enter") {
      handleCellSave(studentId, assignmentId);
    } else if (e.key === "Escape") {
      handleCellCancel();
    }
  };

  const getGradeColor = (score, maxPoints) => {
    const percentage = (score / maxPoints) * 100;
    if (percentage >= 90) return "bg-success-50 text-success-800";
    if (percentage >= 80) return "bg-primary-50 text-primary-800";
    if (percentage >= 70) return "bg-warning-50 text-warning-800";
    return "bg-error-50 text-error-800";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50">
            <tr>
              <th className="sticky left-0 z-10 bg-secondary-50 px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Student
              </th>
              {assignments.map((assignment) => (
                <th
                  key={assignment.Id}
                  className="px-4 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider min-w-[100px]"
                >
                  <div>
                    <div className="font-semibold">{assignment.name}</div>
                    <div className="text-xs text-secondary-400">
                      {assignment.points} pts
                    </div>
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Average
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-secondary-200">
            {students.map((student, index) => {
              const studentGrades = assignments.map(assignment => {
                const grade = getGrade(student.Id, assignment.Id);
                return { assignmentId: assignment.Id, score: grade, points: assignment.points };
              });
              
              const totalPoints = studentGrades.reduce((sum, grade) => sum + (grade.score || 0), 0);
              const maxPoints = assignments.reduce((sum, assignment) => sum + assignment.points, 0);
              const average = maxPoints > 0 ? ((totalPoints / maxPoints) * 100).toFixed(1) : "0.0";

              return (
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
                  {assignments.map((assignment) => {
                    const currentGrade = getGrade(student.Id, assignment.Id);
                    const isEditing = editingCell?.studentId === student.Id && editingCell?.assignmentId === assignment.Id;
                    
                    return (
                      <td key={assignment.Id} className="px-4 py-4 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center">
                            <Input
                              type="number"
                              value={tempValue}
                              onChange={(e) => setTempValue(e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, student.Id, assignment.Id)}
                              className="w-16 text-center"
                              min="0"
                              max={assignment.points}
                              autoFocus
                            />
                            <div className="ml-2 flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCellSave(student.Id, assignment.Id)}
                              >
                                <ApperIcon name="Check" className="h-4 w-4 text-success-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCellCancel}
                              >
                                <ApperIcon name="X" className="h-4 w-4 text-error-600" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`grade-cell inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium cursor-pointer min-w-[60px] ${
                              currentGrade ? getGradeColor(currentGrade, assignment.points) : "bg-secondary-100 text-secondary-600"
                            }`}
                            onClick={() => handleCellClick(student.Id, assignment.Id, currentGrade)}
                          >
                            {currentGrade || "-"}
                          </div>
                        )}
                      </td>
                    );
                  })}
<td className="px-4 py-4 text-center">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(parseFloat(average), 100)}`}>
                      {average}%
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradesGrid;