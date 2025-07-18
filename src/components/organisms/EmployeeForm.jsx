import { useState } from "react";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { format } from "date-fns";

const EmployeeForm = ({ employee, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: employee?.name || "",
    email: employee?.email || "",
    department: employee?.department || "",
    position: employee?.position || "",
    phone: employee?.phone || "",
    hireDate: employee?.hireDate ? format(new Date(employee.hireDate), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    status: employee?.status || "active",
    employeeId: employee?.employeeId || "",
    subjects: employee?.subjects ? employee.subjects.join(", ") : ""
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }
    
    if (!formData.position.trim()) {
      newErrors.position = "Position is required";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    if (!formData.hireDate) {
      newErrors.hireDate = "Hire date is required";
    }
    
    if (!formData.employeeId.trim()) {
      newErrors.employeeId = "Employee ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        subjects: formData.subjects.split(",").map(s => s.trim()).filter(s => s)
      };
      onSubmit(submitData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const departmentOptions = [
    { value: "", label: "Select Department" },
    { value: "Administration", label: "Administration" },
    { value: "Mathematics", label: "Mathematics" },
    { value: "Science", label: "Science" },
    { value: "English", label: "English" },
    { value: "History", label: "History" },
    { value: "Foreign Language", label: "Foreign Language" },
    { value: "Physical Education", label: "Physical Education" },
    { value: "Arts", label: "Arts" },
    { value: "Music", label: "Music" },
    { value: "Technology", label: "Technology" },
    { value: "Special Education", label: "Special Education" },
    { value: "Support Services", label: "Support Services" },
    { value: "Health Services", label: "Health Services" }
  ];

  const positionOptions = [
    { value: "", label: "Select Position" },
    { value: "Principal", label: "Principal" },
    { value: "Vice Principal", label: "Vice Principal" },
    { value: "Department Head", label: "Department Head" },
    { value: "Teacher", label: "Teacher" },
    { value: "Chemistry Teacher", label: "Chemistry Teacher" },
    { value: "Mathematics Teacher", label: "Mathematics Teacher" },
    { value: "English Teacher", label: "English Teacher" },
    { value: "History Teacher", label: "History Teacher" },
    { value: "Science Teacher", label: "Science Teacher" },
    { value: "PE Teacher", label: "PE Teacher" },
    { value: "Art Teacher", label: "Art Teacher" },
    { value: "Music Teacher", label: "Music Teacher" },
    { value: "Spanish Teacher", label: "Spanish Teacher" },
    { value: "Special Education Teacher", label: "Special Education Teacher" },
    { value: "School Counselor", label: "School Counselor" },
    { value: "Librarian", label: "Librarian" },
    { value: "School Nurse", label: "School Nurse" },
    { value: "IT Coordinator", label: "IT Coordinator" },
    { value: "Administrative Assistant", label: "Administrative Assistant" }
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "on_leave", label: "On Leave" }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="Full Name"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        error={errors.name}
        placeholder="Enter full name"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
          placeholder="Enter email address"
        />
        <FormField
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          error={errors.phone}
          placeholder="Enter phone number"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          type="select"
          label="Department"
          value={formData.department}
          onChange={(e) => handleChange("department", e.target.value)}
          error={errors.department}
          options={departmentOptions}
        />
        <FormField
          type="select"
          label="Position"
          value={formData.position}
          onChange={(e) => handleChange("position", e.target.value)}
          error={errors.position}
          options={positionOptions}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Employee ID"
          value={formData.employeeId}
          onChange={(e) => handleChange("employeeId", e.target.value)}
          error={errors.employeeId}
          placeholder="Enter employee ID"
        />
        <FormField
          type="select"
          label="Status"
          value={formData.status}
          onChange={(e) => handleChange("status", e.target.value)}
          error={errors.status}
          options={statusOptions}
        />
      </div>

      <FormField
        label="Hire Date"
        type="date"
        value={formData.hireDate}
        onChange={(e) => handleChange("hireDate", e.target.value)}
        error={errors.hireDate}
      />

      <FormField
        label="Subjects (for teachers)"
        value={formData.subjects}
        onChange={(e) => handleChange("subjects", e.target.value)}
        error={errors.subjects}
        placeholder="Enter subjects separated by commas"
        helperText="Leave blank if not applicable"
      />

      <div className="flex items-center justify-end gap-3 pt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit">
          {employee ? "Update Employee" : "Add Employee"}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;