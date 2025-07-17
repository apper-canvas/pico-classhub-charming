import attendanceData from "@/services/mockData/attendance.json";

let attendance = [...attendanceData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const attendanceService = {
  async getAll() {
    await delay(300);
    return [...attendance];
  },

  async getById(id) {
    await delay(200);
    const record = attendance.find(a => a.Id === id);
    if (!record) {
      throw new Error("Attendance record not found");
    }
    return { ...record };
  },

  async getByStudentId(studentId) {
    await delay(300);
    return attendance.filter(a => a.studentId === studentId);
  },

  async getByClassId(classId) {
    await delay(300);
    return attendance.filter(a => a.classId === classId);
  },

  async getByDate(date) {
    await delay(300);
    return attendance.filter(a => a.date === date);
  },

  async create(attendanceData) {
    await delay(400);
    const newRecord = {
      ...attendanceData,
      Id: Math.max(...attendance.map(a => a.Id), 0) + 1,
    };
    attendance.push(newRecord);
    return { ...newRecord };
  },

  async update(id, attendanceData) {
    await delay(400);
    const index = attendance.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    attendance[index] = { ...attendance[index], ...attendanceData };
    return { ...attendance[index] };
  },

  async updateByStudentAndDate(studentId, date, status, classId = "1") {
    await delay(400);
    const existingRecord = attendance.find(a => a.studentId === studentId && a.date === date);
    
    if (existingRecord) {
      existingRecord.status = status;
      return { ...existingRecord };
    } else {
      const newRecord = {
        Id: Math.max(...attendance.map(a => a.Id), 0) + 1,
        studentId,
        classId,
        date,
        status,
        notes: "",
      };
      attendance.push(newRecord);
      return { ...newRecord };
    }
  },

  async delete(id) {
    await delay(300);
    const index = attendance.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    attendance.splice(index, 1);
    return true;
  },
};