import { motion } from "framer-motion";
import { Home, Briefcase, ClipboardList, Layout, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom"; 

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation(); 

  const menuItems = [
    { icon: <Home size={20} />, label: "Dashboard", path: "/" },
    { icon: <Briefcase size={20} />, label: "Projects", path: "/projects" },
    { icon: <ClipboardList size={20} />, label: "Tasks", path: "/tasks" },
  ];

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col h-screen
        lg:sticky lg:top-0 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
    
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto p-5">
        {menuItems.map((item, index) => {
         
          const isActive = location.pathname === item.path;

          return (
            <Link key={index} to={item.path} onClick={onClose}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer group transition-all mb-2 ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-100" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3 font-bold text-sm">
                  <span className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"}`}>
                    {item.icon}
                  </span>
                  <span className="capitalize">{item.label}</span>
                </div>
                {isActive && (
                  <motion.div layoutId="arrow">
                    <ChevronRight size={16} className="text-white/70" />
                  </motion.div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}