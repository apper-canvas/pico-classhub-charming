import { useState } from "react";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { format } from "date-fns";

const StudentForm = ({ student, onSubmit, onCancel }) => {
const [formData, setFormData] = useState({
    fullName: student ? `${student.firstName} ${student.lastName}` : "",
    email: student?.email || "",
    grade: student?.grade || "",
    dateOfBirth: student?.dateOfBirth ? format(new Date(student.dateOfBirth), "yyyy-MM-dd") : "",
    enrollmentDate: student?.enrollmentDate ? format(new Date(student.enrollmentDate), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    parentEmail: student?.parentEmail || "",
    parentPhone: student?.parentPhone || "",
    status: student?.status || "active",
  });

  const [errors, setErrors] = useState({});

const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.parentEmail.trim()) {
      newErrors.parentEmail = "Parent email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) {
      newErrors.parentEmail = "Please enter a valid parent email address";
    }
    
    if (!formData.parentPhone.trim()) {
      newErrors.parentPhone = "Parent phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.parentPhone)) {
      newErrors.parentPhone = "Please enter a valid phone number";
    }
    
    if (!formData.grade.trim()) {
      newErrors.grade = "Grade is required";
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }
    
    if (!formData.enrollmentDate) {
      newErrors.enrollmentDate = "Joining date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Split fullName into firstName and lastName for backend compatibility
      const [firstName, ...lastNameParts] = formData.fullName.trim().split(' ');
      const lastName = lastNameParts.join(' ') || '';
      
      const submitData = {
        ...formData,
        firstName,
        lastName
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

  const gradeOptions = [
    { value: "", label: "Select Grade" },
    { value: "K", label: "Kindergarten" },
    { value: "1", label: "1st Grade" },
    { value: "2", label: "2nd Grade" },
    { value: "3", label: "3rd Grade" },
    { value: "4", label: "4th Grade" },
    { value: "5", label: "5th Grade" },
    { value: "6", label: "6th Grade" },
    { value: "7", label: "7th Grade" },
    { value: "8", label: "8th Grade" },
    { value: "9", label: "9th Grade" },
    { value: "10", label: "10th Grade" },
    { value: "11", label: "11th Grade" },
    { value: "12", label: "12th Grade" },
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  return (
<form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="Full Name"
        value={formData.fullName}
        onChange={(e) => handleChange("fullName", e.target.value)}
        error={errors.fullName}
        placeholder="Enter full name"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
          placeholder="Enter student email address"
        />
        <FormField
          label="Parent Email"
          type="email"
          value={formData.parentEmail}
          onChange={(e) => handleChange("parentEmail", e.target.value)}
          error={errors.parentEmail}
          placeholder="Enter parent email address"
        />
      </div>

      <FormField
        label="Parent Phone Number"
        type="tel"
        value={formData.parentPhone}
        onChange={(e) => handleChange("parentPhone", e.target.value)}
        error={errors.parentPhone}
        placeholder="Enter parent phone number"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          type="select"
          label="Grade"
          value={formData.grade}
          onChange={(e) => handleChange("grade", e.target.value)}
          error={errors.grade}
          options={gradeOptions}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Date of Birth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleChange("dateOfBirth", e.target.value)}
          error={errors.dateOfBirth}
        />
<FormField
          label="Joining Date"
          type="date"
          value={formData.enrollmentDate}
          onChange={(e) => handleChange("enrollmentDate", e.target.value)}
          error={errors.enrollmentDate}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit">
          {student ? "Update Student" : "Add Student"}
        </Button>
      </div>
    </form>
  );
};

export default StudentForm;