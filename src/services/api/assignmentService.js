const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const assignmentService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "category_c" } },
          { field: { Name: "points_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('assignment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching assignments:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "category_c" } },
          { field: { Name: "points_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.getRecordById('assignment_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching assignment with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error(`Error fetching assignment with ID ${id}:`, error.message);
        throw new Error(error.message);
      }
    }
  },

  async getByClassId(classId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "category_c" } },
          { field: { Name: "points_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "class_id_c",
            Operator: "EqualTo",
            Values: [classId]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('assignment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments by class:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching assignments by class:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async create(assignmentData) {
    try {
      const params = {
        records: [{
          Name: assignmentData.Name,
          category_c: assignmentData.category_c,
          points_c: assignmentData.points_c,
          due_date_c: assignmentData.due_date_c,
          weight_c: assignmentData.weight_c,
          class_id_c: assignmentData.class_id_c,
          Tags: assignmentData.Tags
        }]
      };
      
      const response = await apperClient.createRecord('assignment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create assignment:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        return response.results[0].data;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating assignment:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error creating assignment:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async update(id, assignmentData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: assignmentData.Name,
          category_c: assignmentData.category_c,
          points_c: assignmentData.points_c,
          due_date_c: assignmentData.due_date_c,
          weight_c: assignmentData.weight_c,
          class_id_c: assignmentData.class_id_c,
          Tags: assignmentData.Tags
        }]
      };
      
      const response = await apperClient.updateRecord('assignment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update assignment:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        return response.results[0].data;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating assignment:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error updating assignment:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('assignment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete assignment:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting assignment:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error deleting assignment:", error.message);
        throw new Error(error.message);
      }
    }
  }
};