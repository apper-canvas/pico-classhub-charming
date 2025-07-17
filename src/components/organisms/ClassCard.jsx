import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ClassCard = ({ classData, onViewGrades, onViewAttendance, onEdit, onDelete }) => {
  const studentCount = classData.studentIds?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-secondary-900 mb-1">
              {classData.name}
            </h3>
            <p className="text-sm text-secondary-600 mb-2">{classData.subject}</p>
            <div className="flex items-center gap-4 text-sm text-secondary-500">
              <div className="flex items-center gap-1">
                <ApperIcon name="Clock" className="h-4 w-4" />
                <span>Period {classData.period}</span>
              </div>
              <div className="flex items-center gap-1">
                <ApperIcon name="MapPin" className="h-4 w-4" />
                <span>Room {classData.room}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(classData)}
            >
              <ApperIcon name="Edit" className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(classData.Id)}
              className="text-error-600 hover:text-error-800"
            >
              <ApperIcon name="Trash2" className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-secondary-600">
            <ApperIcon name="Users" className="h-4 w-4" />
            <span>{studentCount} students enrolled</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onViewGrades(classData)}
            className="flex-1"
          >
            <ApperIcon name="GraduationCap" className="h-4 w-4" />
            View Grades
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewAttendance(classData)}
            className="flex-1"
          >
            <ApperIcon name="Calendar" className="h-4 w-4" />
            Attendance
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default ClassCard;