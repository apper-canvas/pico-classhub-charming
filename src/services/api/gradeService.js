import gradesData from "@/services/mockData/grades.json";

let grades = [...gradesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const gradeService = {
  async getAll() {
    await delay(300);
    return [...grades];
  },

  async getById(id) {
    await delay(200);
    const grade = grades.find(g => g.Id === id);
    if (!grade) {
      throw new Error("Grade not found");
    }
    return { ...grade };
  },

  async getByStudentId(studentId) {
    await delay(300);
    return grades.filter(g => g.studentId === studentId);
  },

  async getByAssignmentId(assignmentId) {
    await delay(300);
    return grades.filter(g => g.assignmentId === assignmentId);
  },

  async create(gradeData) {
    await delay(400);
    const newGrade = {
      ...gradeData,
      Id: Math.max(...grades.map(g => g.Id), 0) + 1,
    };
    grades.push(newGrade);
    return { ...newGrade };
  },

  async update(id, gradeData) {
    await delay(400);
    const index = grades.findIndex(g => g.Id === id);
    if (index === -1) {
      throw new Error("Grade not found");
    }
    grades[index] = { ...grades[index], ...gradeData };
    return { ...grades[index] };
  },

  async updateByStudentAndAssignment(studentId, assignmentId, score) {
    await delay(400);
    const existingGrade = grades.find(g => g.studentId === studentId && g.assignmentId === assignmentId);
    
    if (existingGrade) {
      existingGrade.score = score;
      existingGrade.submittedDate = new Date().toISOString();
      return { ...existingGrade };
    } else {
      const newGrade = {
        Id: Math.max(...grades.map(g => g.Id), 0) + 1,
        studentId,
        assignmentId,
        score,
        submittedDate: new Date().toISOString(),
        notes: "",
      };
      grades.push(newGrade);
      return { ...newGrade };
    }
  },

  async delete(id) {
    await delay(300);
    const index = grades.findIndex(g => g.Id === id);
    if (index === -1) {
      throw new Error("Grade not found");
    }
    grades.splice(index, 1);
    return true;
  },
};