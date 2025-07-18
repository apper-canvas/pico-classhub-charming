import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ProgressRing from "@/components/molecules/ProgressRing";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";
import { gradeService } from "@/services/api/gradeService";
import { employeeService } from "@/services/api/employeeService";
import { attendanceService } from "@/services/api/attendanceService";
import { assignmentService } from "@/services/api/assignmentService";
import { format, subDays, isToday } from "date-fns";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
const [assignments, setAssignments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
const [studentsData, classesData, gradesData, attendanceData, assignmentsData, employeesData] = await Promise.all([
        studentService.getAll(),
        classService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll(),
assignmentService.getAll(),
        employeeService.getAll()
      ]);

      setStudents(studentsData);
      setClasses(classesData);
      setGrades(gradesData);
setAssignments(assignmentsData);
      setEmployees(employeesData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

const calculateStats = () => {
    const totalEmployees = employees.length;
    const totalStudents = students.length;
    const totalClasses = classes.length;
    
    // Calculate today's attendance rate
    const today = format(new Date(), "yyyy-MM-dd");
    const todayAttendance = attendance.filter(a => a.date === today);
    const presentToday = todayAttendance.filter(a => a.status === "present").length;
    const attendanceRate = todayAttendance.length > 0 ? (presentToday / todayAttendance.length) * 100 : 0;
    
    // Calculate average grade
    const totalGrades = grades.length;
    const gradeSum = grades.reduce((sum, grade) => {
      const assignment = assignments.find(a => a.Id === grade.assignmentId);
      return sum + (assignment ? (grade.score / assignment.points) * 100 : 0);
    }, 0);
    const averageGrade = totalGrades > 0 ? gradeSum / totalGrades : 0;

    return {
      totalStudents,
      totalClasses,
      attendanceRate,
averageGrade,
      totalEmployees
    };
  };

  const getRecentActivity = () => {
    const recentGrades = grades
      .filter(g => g.submittedDate)
      .sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate))
      .slice(0, 5);

    return recentGrades.map(grade => {
      const student = students.find(s => s.Id === grade.studentId);
      const assignment = assignments.find(a => a.Id === grade.assignmentId);
      return {
        type: "grade",
        student: student ? `${student.firstName} ${student.lastName}` : "Unknown",
        assignment: assignment ? assignment.name : "Unknown",
        score: grade.score,
        maxScore: assignment ? assignment.points : 100,
        date: grade.submittedDate
      };
    });
  };

  const getUpcomingAssignments = () => {
    const today = new Date();
    const upcoming = assignments
      .filter(a => new Date(a.dueDate) >= today)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);

    return upcoming.map(assignment => {
      const classData = classes.find(c => c.Id === parseInt(assignment.classId));
      return {
        ...assignment,
        className: classData ? classData.name : "Unknown Class"
      };
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Loading type="stats" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Loading type="cards" />
          <Loading type="cards" />
        </div>
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  const stats = calculateStats();
  const recentActivity = getRecentActivity();
  const upcomingAssignments = getUpcomingAssignments();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
          <p className="text-secondary-600">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate("/students")}
          >
<ApperIcon name="Users" className="h-4 w-4" />
            Manage Students
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/employees")}
          >
            <ApperIcon name="UserCheck" className="h-4 w-4" />
            Manage Employees
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate("/grades")}
          >
            <ApperIcon name="GraduationCap" className="h-4 w-4" />
            Enter Grades
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon="Users"
          color="primary"
        />
        <StatCard
          title="Total Classes"
          value={stats.totalClasses}
          icon="BookOpen"
          color="secondary"
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats.attendanceRate.toFixed(1)}%`}
          icon="Calendar"
          color="success"
          trend={stats.attendanceRate > 85 ? "up" : "down"}
          trendValue={`${stats.attendanceRate > 85 ? "Good" : "Needs Attention"}`}
        />
        <StatCard
          title="Average Grade"
          value={`${stats.averageGrade.toFixed(1)}%`}
          icon="GraduationCap"
          color="primary"
          trend={stats.averageGrade > 80 ? "up" : "down"}
          trendValue={`${stats.averageGrade > 80 ? "Above Target" : "Below Target"}`}
/>
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon="UserCheck"
          color="warning"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900">Recent Activity</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/grades")}
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary-50 hover:bg-secondary-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <ApperIcon name="GraduationCap" className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900">
                      {activity.student} - {activity.assignment}
                    </p>
                    <p className="text-xs text-secondary-600">
                      Score: {activity.score}/{activity.maxScore} • {format(new Date(activity.date), "MMM d")}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-secondary-500">
                No recent activity to display
              </div>
            )}
          </div>
        </Card>

        {/* Upcoming Assignments */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900">Upcoming Assignments</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/grades")}
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {upcomingAssignments.length > 0 ? (
              upcomingAssignments.map((assignment, index) => (
                <motion.div
                  key={assignment.Id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary-50 hover:bg-secondary-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-warning-500 to-warning-600 rounded-full flex items-center justify-center">
                    <ApperIcon name="Calendar" className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900">
                      {assignment.name}
                    </p>
                    <p className="text-xs text-secondary-600">
                      {assignment.className} • Due {format(new Date(assignment.dueDate), "MMM d")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-secondary-500">{assignment.points} pts</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-secondary-500">
                No upcoming assignments
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Class Performance Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Class Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((classItem) => {
            const classStudents = students.filter(s => classItem.studentIds.includes(s.Id));
            const classGrades = grades.filter(g => {
              const assignment = assignments.find(a => a.Id === g.assignmentId);
              return assignment && assignment.classId === classItem.Id.toString();
            });
            
            const classAttendance = attendance.filter(a => a.classId === classItem.Id.toString());
            const presentCount = classAttendance.filter(a => a.status === "present").length;
            const attendanceRate = classAttendance.length > 0 ? (presentCount / classAttendance.length) * 100 : 0;
            
            const avgGrade = classGrades.length > 0 ? 
              classGrades.reduce((sum, grade) => {
                const assignment = assignments.find(a => a.Id === grade.assignmentId);
                return sum + (assignment ? (grade.score / assignment.points) * 100 : 0);
              }, 0) / classGrades.length : 0;

            return (
              <motion.div
                key={classItem.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border border-secondary-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-secondary-900">{classItem.name}</h4>
                    <p className="text-xs text-secondary-600">{classStudents.length} students</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ProgressRing progress={attendanceRate} size={40} strokeWidth={4} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary-600">Avg Grade:</span>
                  <span className="font-medium text-secondary-900">{avgGrade.toFixed(1)}%</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;