import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Modal from "@/components/molecules/Modal";
import EmployeesTable from "@/components/organisms/EmployeesTable";
import EmployeeForm from "@/components/organisms/EmployeeForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { employeeService } from "@/services/api/employeeService";
import { toast } from "react-toastify";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, selectedDepartment, selectedStatus]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = [...employees];

    if (searchTerm) {
      filtered = filtered.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment) {
      filtered = filtered.filter(employee => employee.department === selectedDepartment);
    }

    if (selectedStatus) {
      filtered = filtered.filter(employee => employee.status === selectedStatus);
    }

    setFilteredEmployees(filtered);
  };

  const handleAddEmployee = async (employeeData) => {
    try {
      const newEmployee = await employeeService.create(employeeData);
      setEmployees(prev => [...prev, newEmployee]);
      setShowAddModal(false);
      toast.success("Employee added successfully!");
    } catch (err) {
      toast.error("Failed to add employee: " + err.message);
    }
  };

  const handleEditEmployee = async (employeeData) => {
    try {
      const updatedEmployee = await employeeService.update(selectedEmployee.Id, employeeData);
      setEmployees(prev => prev.map(e => e.Id === selectedEmployee.Id ? updatedEmployee : e));
      setShowEditModal(false);
      setSelectedEmployee(null);
      toast.success("Employee updated successfully!");
    } catch (err) {
      toast.error("Failed to update employee: " + err.message);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await employeeService.delete(employeeId);
        setEmployees(prev => prev.filter(e => e.Id !== employeeId));
        toast.success("Employee deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete employee: " + err.message);
      }
    }
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const getUniqueDepartments = () => {
    const departments = [...new Set(employees.map(e => e.department))];
    return departments.sort();
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadEmployees} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Employees</h1>
          <p className="text-secondary-600">Manage your school staff</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
        >
          <ApperIcon name="Plus" className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-secondary-200">
        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search employees..."
          className="flex-1"
        />
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="px-3 py-2 border border-secondary-200 rounded-lg bg-white text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Departments</option>
          {getUniqueDepartments().map(dept => (
            <option key={dept} value={dept}>{dept}</option>
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
          <option value="on_leave">On Leave</option>
        </select>
      </div>

      {/* Employees Table */}
      {filteredEmployees.length > 0 ? (
        <EmployeesTable
          employees={filteredEmployees}
          onEdit={handleEditClick}
          onDelete={handleDeleteEmployee}
          onView={handleViewEmployee}
        />
      ) : (
        <Empty
          title="No employees found"
          message={searchTerm || selectedDepartment || selectedStatus ? 
            "No employees match your current filters. Try adjusting your search criteria." :
            "Get started by adding your first employee to the staff roster."
          }
          icon="UserCheck"
          actionText="Add Employee"
          onAction={() => setShowAddModal(true)}
        />
      )}

      {/* Add Employee Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Employee"
        size="lg"
      >
        <EmployeeForm
          onSubmit={handleAddEmployee}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Employee Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedEmployee(null);
        }}
        title="Edit Employee"
        size="lg"
      >
        {selectedEmployee && (
          <EmployeeForm
            employee={selectedEmployee}
            onSubmit={handleEditEmployee}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedEmployee(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Employees;