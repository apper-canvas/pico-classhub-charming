const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const studentService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "date_of_birth_c" } },
          { field: { Name: "enrollment_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('student_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching students:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching students:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "date_of_birth_c" } },
          { field: { Name: "enrollment_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.getRecordById('student_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching student with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error(`Error fetching student with ID ${id}:`, error.message);
        throw new Error(error.message);
      }
    }
  },

  async create(studentData) {
    try {
      const params = {
        records: [{
          Name: studentData.Name,
          first_name_c: studentData.first_name_c,
          last_name_c: studentData.last_name_c,
          email_c: studentData.email_c,
          grade_c: studentData.grade_c,
          date_of_birth_c: studentData.date_of_birth_c,
          enrollment_date_c: studentData.enrollment_date_c,
          status_c: studentData.status_c,
          Tags: studentData.Tags
        }]
      };
      
      const response = await apperClient.createRecord('student_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create student:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        return response.results[0].data;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating student:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error creating student:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async update(id, studentData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: studentData.Name,
          first_name_c: studentData.first_name_c,
          last_name_c: studentData.last_name_c,
          email_c: studentData.email_c,
          grade_c: studentData.grade_c,
          date_of_birth_c: studentData.date_of_birth_c,
          enrollment_date_c: studentData.enrollment_date_c,
          status_c: studentData.status_c,
          Tags: studentData.Tags
        }]
      };
      
      const response = await apperClient.updateRecord('student_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update student:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        return response.results[0].data;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating student:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error updating student:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('student_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete student:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting student:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error deleting student:", error.message);
        throw new Error(error.message);
      }
    }
  }
};