import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import GradesGrid from "@/components/organisms/GradesGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { classService } from "@/services/api/classService";
import { studentService } from "@/services/api/studentService";
import { assignmentService } from "@/services/api/assignmentService";
import { gradeService } from "@/services/api/gradeService";
import { toast } from "react-toastify";

const Grades = () => {
  const [searchParams] = useSearchParams();
  const initialClassId = searchParams.get("classId");
  
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(initialClassId || "");
  const [classStudents, setClassStudents] = useState([]);
  const [classAssignments, setClassAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    name: "",
    category: "",
    points: "",
    dueDate: "",
    weight: ""
  });
  const [assignmentErrors, setAssignmentErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      loadClassData();
    }
  }, [selectedClassId, students, assignments, grades]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [classesData, studentsData, assignmentsData, gradesData] = await Promise.all([
        classService.getAll(),
        studentService.getAll(),
        assignmentService.getAll(),
        gradeService.getAll()
      ]);
      setClasses(classesData);
      setStudents(studentsData);
      setAssignments(assignmentsData);
      setGrades(gradesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadClassData = () => {
    if (!selectedClassId) {
      setClassStudents([]);
      setClassAssignments([]);
      return;
    }

    const selectedClass = classes.find(c => c.Id === parseInt(selectedClassId));
    if (selectedClass) {
      const enrolledStudents = students.filter(s => selectedClass.studentIds.includes(s.Id));
      const classAssignmentList = assignments.filter(a => a.classId === selectedClassId);
      setClassStudents(enrolledStudents);
      setClassAssignments(classAssignmentList);
    }
  };

  const handleUpdateGrade = async (studentId, assignmentId, score) => {
    try {
      await gradeService.updateByStudentAndAssignment(studentId, assignmentId, score);
      const updatedGrades = await gradeService.getAll();
      setGrades(updatedGrades);
    } catch (err) {
      throw new Error("Failed to update grade");
    }
  };

  const validateAssignmentForm = () => {
    const errors = {};
    
    if (!assignmentForm.name.trim()) errors.name = "Assignment name is required";
    if (!assignmentForm.category.trim()) errors.category = "Category is required";
    if (!assignmentForm.points || assignmentForm.points <= 0) errors.points = "Points must be greater than 0";
    if (!assignmentForm.dueDate) errors.dueDate = "Due date is required";
    if (!assignmentForm.weight || assignmentForm.weight <= 0 || assignmentForm.weight > 1) {
      errors.weight = "Weight must be between 0 and 1";
    }

    setAssignmentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    if (!validateAssignmentForm() || !selectedClassId) return;

    try {
      const assignmentData = {
        ...assignmentForm,
        classId: selectedClassId,
        points: parseInt(assignmentForm.points),
        weight: parseFloat(assignmentForm.weight)
      };
      
      const newAssignment = await assignmentService.create(assignmentData);
      setAssignments(prev => [...prev, newAssignment]);
      setShowAddAssignmentModal(false);
      setAssignmentForm({
        name: "",
        category: "",
        points: "",
        dueDate: "",
        weight: ""
      });
      toast.success("Assignment added successfully!");
    } catch (err) {
      toast.error("Failed to add assignment: " + err.message);
    }
  };

  const categoryOptions = [
    { value: "", label: "Select Category" },
    { value: "homework", label: "Homework" },
    { value: "quiz", label: "Quiz" },
    { value: "test", label: "Test" },
    { value: "exam", label: "Exam" },
    { value: "project", label: "Project" },
    { value: "lab", label: "Lab" },
    { value: "essay", label: "Essay" },
    { value: "presentation", label: "Presentation" },
  ];

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Grades</h1>
          <p className="text-secondary-600">Manage assignments and student grades</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => setShowAddAssignmentModal(true)}
            disabled={!selectedClassId}
          >
            <ApperIcon name="Plus" className="h-4 w-4" />
            Add Assignment
          </Button>
        </div>
      </div>

      {/* Class Selection */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-secondary-200">
        <Select
          label="Select Class"
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="max-w-md"
        >
          <option value="">Choose a class...</option>
          {classes.map(classItem => (
            <option key={classItem.Id} value={classItem.Id}>
              {classItem.name} - {classItem.subject}
            </option>
          ))}
        </Select>
      </div>

      {/* Grades Content */}
      {selectedClassId ? (
        classStudents.length > 0 && classAssignments.length > 0 ? (
          <GradesGrid
            students={classStudents}
            assignments={classAssignments}
            grades={grades}
            onUpdateGrade={handleUpdateGrade}
          />
        ) : (
          <Empty
            title={classAssignments.length === 0 ? "No assignments found" : "No students enrolled"}
            message={classAssignments.length === 0 ? 
              "Create your first assignment to start tracking grades." :
              "No students are enrolled in this class yet."
            }
            icon={classAssignments.length === 0 ? "GraduationCap" : "Users"}
            actionText={classAssignments.length === 0 ? "Add Assignment" : "Manage Classes"}
            onAction={() => {
              if (classAssignments.length === 0) {
                setShowAddAssignmentModal(true);
              }
            }}
          />
        )
      ) : (
        <Empty
          title="Select a class to view grades"
          message="Choose a class from the dropdown above to start entering and managing grades."
          icon="BookOpen"
        />
      )}

      {/* Add Assignment Modal */}
      <Modal
        isOpen={showAddAssignmentModal}
        onClose={() => {
          setShowAddAssignmentModal(false);
          setAssignmentForm({
            name: "",
            category: "",
            points: "",
            dueDate: "",
            weight: ""
          });
          setAssignmentErrors({});
        }}
        title="Add New Assignment"
        size="lg"
      >
        <form onSubmit={handleAddAssignment} className="space-y-6">
          <FormField
            label="Assignment Name"
            value={assignmentForm.name}
            onChange={(e) => setAssignmentForm(prev => ({ ...prev, name: e.target.value }))}
            error={assignmentErrors.name}
            placeholder="Enter assignment name"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              type="select"
              label="Category"
              value={assignmentForm.category}
              onChange={(e) => setAssignmentForm(prev => ({ ...prev, category: e.target.value }))}
              error={assignmentErrors.category}
              options={categoryOptions}
            />
            <FormField
              label="Points"
              type="number"
              value={assignmentForm.points}
              onChange={(e) => setAssignmentForm(prev => ({ ...prev, points: e.target.value }))}
              error={assignmentErrors.points}
              placeholder="Enter total points"
              min="1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Due Date"
              type="date"
              value={assignmentForm.dueDate}
              onChange={(e) => setAssignmentForm(prev => ({ ...prev, dueDate: e.target.value }))}
              error={assignmentErrors.dueDate}
            />
            <FormField
              label="Weight"
              type="number"
              value={assignmentForm.weight}
              onChange={(e) => setAssignmentForm(prev => ({ ...prev, weight: e.target.value }))}
              error={assignmentErrors.weight}
              placeholder="0.0 to 1.0"
              min="0"
              max="1"
              step="0.1"
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddAssignmentModal(false);
                setAssignmentForm({
                  name: "",
                  category: "",
                  points: "",
                  dueDate: "",
                  weight: ""
                });
                setAssignmentErrors({});
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add Assignment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Grades;