import { useState, useEffect, useRef } from "react";
import { Bell, User, Menu, LogOut, UserCircle, ChevronDown, CheckCircle } from "lucide-react"; // CheckCircle ko lucide se import kiya
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ onMenuClick }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-3">
      <div className="flex items-center justify-between">
        
        {}
        <div className="flex items-center gap-4">
          {}
          <button 
            onClick={(e) => {
              e.stopPropagation(); 
              onMenuClick(); 
            }} 
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <CheckCircle size={20} strokeWidth={3} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent hidden sm:block">
              Management Dashboard
            </h1>
          </div>
        </div>

        {}
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </motion.button>

          <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden sm:block"></div>

          <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 pl-2 cursor-pointer select-none group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800 leading-none group-hover:text-blue-600 transition-colors">Admin User</p>
            </div>
            
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 border-2 border-white font-bold text-sm">
                AU
              </div>
            </div>

            <motion.div
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              className="text-gray-400 group-hover:text-gray-600"
            >
              <ChevronDown size={18} />
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-3 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
              >
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <UserCircle size={18} /> My Profile
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors mt-1">
                  <LogOut size={18} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}