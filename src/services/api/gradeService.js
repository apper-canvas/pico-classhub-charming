const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const gradeService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "score_c" } },
          { field: { Name: "submitted_date_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "assignment_id_c" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('grade_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching grades:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "score_c" } },
          { field: { Name: "submitted_date_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "assignment_id_c" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.getRecordById('grade_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching grade with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error(`Error fetching grade with ID ${id}:`, error.message);
        throw new Error(error.message);
      }
    }
  },

  async getByStudentId(studentId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "score_c" } },
          { field: { Name: "submitted_date_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "assignment_id_c" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "student_id_c",
            Operator: "EqualTo",
            Values: [studentId]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('grade_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades by student:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching grades by student:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async getByAssignmentId(assignmentId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "score_c" } },
          { field: { Name: "submitted_date_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "assignment_id_c" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "assignment_id_c",
            Operator: "EqualTo",
            Values: [assignmentId]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('grade_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades by assignment:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching grades by assignment:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async create(gradeData) {
    try {
      const params = {
        records: [{
          Name: gradeData.Name,
          score_c: gradeData.score_c,
          submitted_date_c: gradeData.submitted_date_c,
          notes_c: gradeData.notes_c,
          student_id_c: gradeData.student_id_c,
          assignment_id_c: gradeData.assignment_id_c,
          Tags: gradeData.Tags
        }]
      };
      
      const response = await apperClient.createRecord('grade_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create grade:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        return response.results[0].data;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating grade:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error creating grade:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async update(id, gradeData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: gradeData.Name,
          score_c: gradeData.score_c,
          submitted_date_c: gradeData.submitted_date_c,
          notes_c: gradeData.notes_c,
          student_id_c: gradeData.student_id_c,
          assignment_id_c: gradeData.assignment_id_c,
          Tags: gradeData.Tags
        }]
      };
      
      const response = await apperClient.updateRecord('grade_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update grade:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        return response.results[0].data;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating grade:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error updating grade:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async updateByStudentAndAssignment(studentId, assignmentId, score) {
    try {
      // First try to find existing grade
      const existingGrades = await this.getAll();
      const existingGrade = existingGrades.find(g => 
        g.student_id_c === studentId && g.assignment_id_c === assignmentId
      );
      
      if (existingGrade) {
        // Update existing grade
        return await this.update(existingGrade.Id, {
          Name: existingGrade.Name,
          score_c: score,
          submitted_date_c: new Date().toISOString().split('T')[0],
          notes_c: existingGrade.notes_c,
          student_id_c: studentId,
          assignment_id_c: assignmentId,
          Tags: existingGrade.Tags
        });
      } else {
        // Create new grade
        return await this.create({
          Name: `Grade for Student ${studentId} Assignment ${assignmentId}`,
          score_c: score,
          submitted_date_c: new Date().toISOString().split('T')[0],
          notes_c: "",
          student_id_c: studentId,
          assignment_id_c: assignmentId,
          Tags: ""
        });
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating grade by student and assignment:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error updating grade by student and assignment:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('grade_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete grade:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting grade:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error deleting grade:", error.message);
        throw new Error(error.message);
      }
    }
  }
};