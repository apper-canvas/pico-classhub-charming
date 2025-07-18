import mockEmployees from '@/services/mockData/employees.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let employees = [...mockEmployees];
let nextId = Math.max(...employees.map(e => e.Id)) + 1;

export const employeeService = {
  async getAll() {
    await delay(300);
    return [...employees];
  },

  async getById(id) {
    await delay(300);
    const employee = employees.find(e => e.Id === parseInt(id));
    if (!employee) {
      throw new Error(`Employee with ID ${id} not found`);
    }
    return { ...employee };
  },

async create(employeeData) {
    await delay(300);
    const newEmployee = {
      Id: nextId++,
      name: employeeData.name,
      fullName: employeeData.fullName,
      email: employeeData.email,
      department: employeeData.department,
      position: employeeData.position,
      phone: employeeData.phone,
      hireDate: employeeData.hireDate,
      status: employeeData.status || 'active',
      employeeId: employeeData.employeeId,
      subjects: employeeData.subjects || []
    };
    employees.push(newEmployee);
    return { ...newEmployee };
  },

  async update(id, employeeData) {
    await delay(300);
    const index = employees.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Employee with ID ${id} not found`);
    }
    
const updatedEmployee = {
      ...employees[index],
      name: employeeData.name,
      fullName: employeeData.fullName,
      email: employeeData.email,
      department: employeeData.department,
      position: employeeData.position,
      phone: employeeData.phone,
      hireDate: employeeData.hireDate,
      status: employeeData.status,
      employeeId: employeeData.employeeId,
      subjects: employeeData.subjects || []
    };
    
    employees[index] = updatedEmployee;
    return { ...updatedEmployee };
  },

  async delete(id) {
    await delay(300);
    const index = employees.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Employee with ID ${id} not found`);
    }
    employees.splice(index, 1);
    return true;
  }
};