const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const attendanceService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('attendance_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching attendance:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.getRecordById('attendance_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching attendance with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error(`Error fetching attendance with ID ${id}:`, error.message);
        throw new Error(error.message);
      }
    }
  },

  async getByStudentId(studentId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
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
      
      const response = await apperClient.fetchRecords('attendance_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance by student:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching attendance by student:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async getByClassId(classId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
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
      
      const response = await apperClient.fetchRecords('attendance_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance by class:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching attendance by class:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async getByDate(date) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "date_c",
            Operator: "EqualTo",
            Values: [date]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('attendance_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance by date:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching attendance by date:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async create(attendanceData) {
    try {
      const params = {
        records: [{
          Name: attendanceData.Name,
          student_id_c: attendanceData.student_id_c,
          class_id_c: attendanceData.class_id_c,
          date_c: attendanceData.date_c,
          status_c: attendanceData.status_c,
          notes_c: attendanceData.notes_c,
          Tags: attendanceData.Tags
        }]
      };
      
      const response = await apperClient.createRecord('attendance_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create attendance:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        return response.results[0].data;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating attendance:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error creating attendance:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async update(id, attendanceData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: attendanceData.Name,
          student_id_c: attendanceData.student_id_c,
          class_id_c: attendanceData.class_id_c,
          date_c: attendanceData.date_c,
          status_c: attendanceData.status_c,
          notes_c: attendanceData.notes_c,
          Tags: attendanceData.Tags
        }]
      };
      
      const response = await apperClient.updateRecord('attendance_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update attendance:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        return response.results[0].data;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating attendance:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error updating attendance:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async updateByStudentAndDate(studentId, date, status, classId = "1") {
    try {
      // First try to find existing attendance record
      const existingAttendance = await this.getAll();
      const existingRecord = existingAttendance.find(a => 
        a.student_id_c === studentId && a.date_c === date
      );
      
      if (existingRecord) {
        // Update existing record
        return await this.update(existingRecord.Id, {
          Name: existingRecord.Name,
          student_id_c: studentId,
          class_id_c: classId,
          date_c: date,
          status_c: status,
          notes_c: existingRecord.notes_c,
          Tags: existingRecord.Tags
        });
      } else {
        // Create new record
        return await this.create({
          Name: `Attendance for Student ${studentId} on ${date}`,
          student_id_c: studentId,
          class_id_c: classId,
          date_c: date,
          status_c: status,
          notes_c: "",
          Tags: ""
        });
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating attendance by student and date:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error updating attendance by student and date:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('attendance_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete attendance:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting attendance:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error deleting attendance:", error.message);
        throw new Error(error.message);
      }
    }
  }
};