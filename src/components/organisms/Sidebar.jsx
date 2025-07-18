import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Students", href: "/students", icon: "Users" },
    { name: "Employees", href: "/employees", icon: "UserCheck" },
    { name: "Classes", href: "/classes", icon: "BookOpen" },
    { name: "Grades", href: "/grades", icon: "GraduationCap" },
    { name: "Attendance", href: "/attendance", icon: "Calendar" },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-secondary-200">
      <div className="flex items-center justify-center p-6 border-b border-secondary-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="GraduationCap" className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold gradient-text">ClassHub</h1>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `sidebar-nav-item flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "active text-white"
                  : "text-secondary-700 hover:text-primary-600"
              }`
            }
            onClick={onClose}
          >
            <ApperIcon name={item.icon} className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 h-full">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {isOpen && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={onClose}
          />
        )}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: isOpen ? 0 : "-100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed left-0 top-0 z-50 w-64 h-full lg:hidden"
        >
          {sidebarContent}
        </motion.div>
      </div>
    </>
  );
};

export default Sidebar;