import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Modal from "@/components/molecules/Modal";
import StudentsTable from "@/components/organisms/StudentsTable";
import StudentForm from "@/components/organisms/StudentForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { toast } from "react-toastify";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, selectedGrade, selectedStatus]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];

    if (searchTerm) {
      filtered = filtered.filter(student =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGrade) {
      filtered = filtered.filter(student => student.grade === selectedGrade);
    }

    if (selectedStatus) {
      filtered = filtered.filter(student => student.status === selectedStatus);
    }

    setFilteredStudents(filtered);
  };

  const handleAddStudent = async (studentData) => {
    try {
      const newStudent = await studentService.create(studentData);
      setStudents(prev => [...prev, newStudent]);
      setShowAddModal(false);
      toast.success("Student added successfully!");
    } catch (err) {
      toast.error("Failed to add student: " + err.message);
    }
  };

  const handleEditStudent = async (studentData) => {
    try {
      const updatedStudent = await studentService.update(selectedStudent.Id, studentData);
      setStudents(prev => prev.map(s => s.Id === selectedStudent.Id ? updatedStudent : s));
      setShowEditModal(false);
      setSelectedStudent(null);
      toast.success("Student updated successfully!");
    } catch (err) {
      toast.error("Failed to update student: " + err.message);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await studentService.delete(studentId);
        setStudents(prev => prev.filter(s => s.Id !== studentId));
        toast.success("Student deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete student: " + err.message);
      }
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const getUniqueGrades = () => {
    const grades = [...new Set(students.map(s => s.grade))];
    return grades.sort();
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadStudents} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Students</h1>
          <p className="text-secondary-600">Manage your student roster</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
        >
          <ApperIcon name="Plus" className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-secondary-200">
        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search students..."
          className="flex-1"
        />
        <select
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          className="px-3 py-2 border border-secondary-200 rounded-lg bg-white text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Grades</option>
          {getUniqueGrades().map(grade => (
            <option key={grade} value={grade}>Grade {grade}</option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-secondary-200 rounded-lg bg-white text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Students Table */}
      {filteredStudents.length > 0 ? (
        <StudentsTable
          students={filteredStudents}
          onEdit={handleEditClick}
          onDelete={handleDeleteStudent}
          onView={handleViewStudent}
        />
      ) : (
        <Empty
          title="No students found"
          message={searchTerm || selectedGrade || selectedStatus ? 
            "No students match your current filters. Try adjusting your search criteria." :
            "Get started by adding your first student to the roster."
          }
          icon="Users"
          actionText="Add Student"
          onAction={() => setShowAddModal(true)}
        />
      )}

      {/* Add Student Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Student"
        size="lg"
      >
        <StudentForm
          onSubmit={handleAddStudent}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedStudent(null);
        }}
        title="Edit Student"
        size="lg"
      >
        {selectedStudent && (
          <StudentForm
            student={selectedStudent}
            onSubmit={handleEditStudent}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedStudent(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Students;