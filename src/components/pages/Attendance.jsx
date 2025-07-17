import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import AttendanceGrid from "@/components/organisms/AttendanceGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { classService } from "@/services/api/classService";
import { studentService } from "@/services/api/studentService";
import { attendanceService } from "@/services/api/attendanceService";
import { format, subDays } from "date-fns";
import { toast } from "react-toastify";

const Attendance = () => {
  const [searchParams] = useSearchParams();
  const initialClassId = searchParams.get("classId");
  
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(initialClassId || "");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [classStudents, setClassStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      loadClassData();
    }
  }, [selectedClassId, students]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [classesData, studentsData, attendanceData] = await Promise.all([
        classService.getAll(),
        studentService.getAll(),
        attendanceService.getAll()
      ]);
      setClasses(classesData);
      setStudents(studentsData);
      setAttendance(attendanceData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadClassData = () => {
    if (!selectedClassId) {
      setClassStudents([]);
      return;
    }

    const selectedClass = classes.find(c => c.Id === parseInt(selectedClassId));
    if (selectedClass) {
      const enrolledStudents = students.filter(s => selectedClass.studentIds.includes(s.Id));
      setClassStudents(enrolledStudents);
    }
  };

  const handleUpdateAttendance = async (studentId, date, status) => {
    try {
      await attendanceService.updateByStudentAndDate(studentId, date, status, selectedClassId);
      const updatedAttendance = await attendanceService.getAll();
      setAttendance(updatedAttendance);
    } catch (err) {
      throw new Error("Failed to update attendance");
    }
  };

  const getAttendanceStats = () => {
    if (!selectedClassId || classStudents.length === 0) {
      return { totalSessions: 0, attendanceRate: 0, presentCount: 0, absentCount: 0, tardyCount: 0 };
    }

    const classAttendance = attendance.filter(a => a.classId === selectedClassId);
    const totalSessions = classAttendance.length;
    const presentCount = classAttendance.filter(a => a.status === "present").length;
    const absentCount = classAttendance.filter(a => a.status === "absent").length;
    const tardyCount = classAttendance.filter(a => a.status === "tardy").length;
    const attendanceRate = totalSessions > 0 ? (presentCount / totalSessions) * 100 : 0;

    return {
      totalSessions,
      attendanceRate,
      presentCount,
      absentCount,
      tardyCount
    };
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  const selectedClass = classes.find(c => c.Id === parseInt(selectedClassId));
  const stats = getAttendanceStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Attendance</h1>
          <p className="text-secondary-600">Track student attendance and participation</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-3 py-2 border border-secondary-200 rounded-lg bg-white text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Class Selection */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-secondary-200">
        <Select
          label="Select Class"
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="max-w-md"
        >
          <option value="">Choose a class...</option>
          {classes.map(classItem => (
            <option key={classItem.Id} value={classItem.Id}>
              {classItem.name} - {classItem.subject}
            </option>
          ))}
        </Select>
      </div>

      {/* Attendance Stats */}
      {selectedClassId && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">Class</p>
                <p className="text-lg font-semibold text-secondary-900">{selectedClass?.name}</p>
              </div>
              <ApperIcon name="BookOpen" className="h-8 w-8 text-primary-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">Present</p>
                <p className="text-lg font-semibold text-success-600">{stats.presentCount}</p>
              </div>
              <ApperIcon name="CheckCircle" className="h-8 w-8 text-success-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">Absent</p>
                <p className="text-lg font-semibold text-error-600">{stats.absentCount}</p>
              </div>
              <ApperIcon name="XCircle" className="h-8 w-8 text-error-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">Tardy</p>
                <p className="text-lg font-semibold text-warning-600">{stats.tardyCount}</p>
              </div>
              <ApperIcon name="Clock" className="h-8 w-8 text-warning-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">Rate</p>
                <p className="text-lg font-semibold text-primary-600">{stats.attendanceRate.toFixed(1)}%</p>
              </div>
              <ApperIcon name="TrendingUp" className="h-8 w-8 text-primary-500" />
            </div>
          </div>
        </div>
      )}

      {/* Attendance Grid */}
      {selectedClassId ? (
        classStudents.length > 0 ? (
          <AttendanceGrid
            students={classStudents}
            attendance={attendance}
            selectedDate={selectedDate}
            onUpdateAttendance={handleUpdateAttendance}
          />
        ) : (
          <Empty
            title="No students enrolled"
            message="No students are enrolled in this class yet. Go to the Classes page to add students."
            icon="Users"
          />
        )
      ) : (
        <Empty
          title="Select a class to view attendance"
          message="Choose a class from the dropdown above to start tracking attendance."
          icon="Calendar"
        />
      )}
    </div>
  );
};

export default Attendance;