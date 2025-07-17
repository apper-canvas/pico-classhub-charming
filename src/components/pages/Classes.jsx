import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Modal from "@/components/molecules/Modal";
import ClassCard from "@/components/organisms/ClassCard";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { classService } from "@/services/api/classService";
import { studentService } from "@/services/api/studentService";
import { toast } from "react-toastify";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    period: "",
    room: "",
    studentIds: []
  });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterClasses();
  }, [classes, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [classesData, studentsData] = await Promise.all([
        classService.getAll(),
        studentService.getAll()
      ]);
      setClasses(classesData);
      setStudents(studentsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterClasses = () => {
    let filtered = [...classes];

    if (searchTerm) {
      filtered = filtered.filter(classItem =>
        classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredClasses(filtered);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      subject: "",
      period: "",
      room: "",
      studentIds: []
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = "Class name is required";
    if (!formData.subject.trim()) errors.subject = "Subject is required";
    if (!formData.period.trim()) errors.period = "Period is required";
    if (!formData.room.trim()) errors.room = "Room is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const newClass = await classService.create(formData);
      setClasses(prev => [...prev, newClass]);
      setShowAddModal(false);
      resetForm();
      toast.success("Class added successfully!");
    } catch (err) {
      toast.error("Failed to add class: " + err.message);
    }
  };

  const handleEditClass = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const updatedClass = await classService.update(selectedClass.Id, formData);
      setClasses(prev => prev.map(c => c.Id === selectedClass.Id ? updatedClass : c));
      setShowEditModal(false);
      setSelectedClass(null);
      resetForm();
      toast.success("Class updated successfully!");
    } catch (err) {
      toast.error("Failed to update class: " + err.message);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await classService.delete(classId);
        setClasses(prev => prev.filter(c => c.Id !== classId));
        toast.success("Class deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete class: " + err.message);
      }
    }
  };

  const handleEditClick = (classItem) => {
    setSelectedClass(classItem);
    setFormData({
      name: classItem.name,
      subject: classItem.subject,
      period: classItem.period,
      room: classItem.room,
      studentIds: classItem.studentIds || []
    });
    setShowEditModal(true);
  };

  const handleViewGrades = (classItem) => {
    navigate(`/grades?classId=${classItem.Id}`);
  };

  const handleViewAttendance = (classItem) => {
    navigate(`/attendance?classId=${classItem.Id}`);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleStudentToggle = (studentId) => {
    setFormData(prev => ({
      ...prev,
      studentIds: prev.studentIds.includes(studentId)
        ? prev.studentIds.filter(id => id !== studentId)
        : [...prev.studentIds, studentId]
    }));
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Classes</h1>
          <p className="text-secondary-600">Manage your class schedules and enrollments</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
        >
          <ApperIcon name="Plus" className="h-4 w-4" />
          Add Class
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-secondary-200">
        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search classes..."
          className="max-w-md"
        />
      </div>

      {/* Classes Grid */}
      {filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classItem) => (
            <ClassCard
              key={classItem.Id}
              classData={classItem}
              onViewGrades={handleViewGrades}
              onViewAttendance={handleViewAttendance}
              onEdit={handleEditClick}
              onDelete={handleDeleteClass}
            />
          ))}
        </div>
      ) : (
        <Empty
          title="No classes found"
          message={searchTerm ? 
            "No classes match your search criteria. Try adjusting your search." :
            "Get started by creating your first class."
          }
          icon="BookOpen"
          actionText="Add Class"
          onAction={() => {
            resetForm();
            setShowAddModal(true);
          }}
        />
      )}

      {/* Add Class Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Add New Class"
        size="lg"
      >
        <form onSubmit={handleAddClass} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Class Name"
              value={formData.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              error={formErrors.name}
              placeholder="Enter class name"
            />
            <FormField
              label="Subject"
              value={formData.subject}
              onChange={(e) => handleFormChange("subject", e.target.value)}
              error={formErrors.subject}
              placeholder="Enter subject"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Period"
              value={formData.period}
              onChange={(e) => handleFormChange("period", e.target.value)}
              error={formErrors.period}
              placeholder="Enter period"
            />
            <FormField
              label="Room"
              value={formData.room}
              onChange={(e) => handleFormChange("room", e.target.value)}
              error={formErrors.room}
              placeholder="Enter room number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Enrolled Students
            </label>
            <div className="max-h-60 overflow-y-auto border border-secondary-200 rounded-lg p-3">
              {students.map(student => (
                <label key={student.Id} className="flex items-center gap-2 p-2 hover:bg-secondary-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.studentIds.includes(student.Id)}
                    onChange={() => handleStudentToggle(student.Id)}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-secondary-900">
                    {student.firstName} {student.lastName} - Grade {student.grade}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add Class
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Class Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedClass(null);
          resetForm();
        }}
        title="Edit Class"
        size="lg"
      >
        <form onSubmit={handleEditClass} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Class Name"
              value={formData.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              error={formErrors.name}
              placeholder="Enter class name"
            />
            <FormField
              label="Subject"
              value={formData.subject}
              onChange={(e) => handleFormChange("subject", e.target.value)}
              error={formErrors.subject}
              placeholder="Enter subject"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Period"
              value={formData.period}
              onChange={(e) => handleFormChange("period", e.target.value)}
              error={formErrors.period}
              placeholder="Enter period"
            />
            <FormField
              label="Room"
              value={formData.room}
              onChange={(e) => handleFormChange("room", e.target.value)}
              error={formErrors.room}
              placeholder="Enter room number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Enrolled Students
            </label>
            <div className="max-h-60 overflow-y-auto border border-secondary-200 rounded-lg p-3">
              {students.map(student => (
                <label key={student.Id} className="flex items-center gap-2 p-2 hover:bg-secondary-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.studentIds.includes(student.Id)}
                    onChange={() => handleStudentToggle(student.Id)}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-secondary-900">
                    {student.firstName} {student.lastName} - Grade {student.grade}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowEditModal(false);
                setSelectedClass(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              Update Class
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Classes;