import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Circle, Clock, Filter, MoreHorizontal, 
  Search, ListTodo, User, Calendar, Trash2, ChevronLeft, ChevronRight, Edit3 
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 6;

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/todos?_limit=30")
      .then(res => {
        const enrichedTasks = res.data.map(t => ({
          ...t,
          assignedTo: t.userId % 2 === 0 ? "Aryan Maurya" : "Google Admin",
          dueDate: new Date(Date.now() + t.id * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        }));
        setTasks(enrichedTasks);
        setLoading(false);
      });
  }, []);

 

 
  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this task?")) {
      setTasks(prev => prev.filter(task => task.id !== id));
    }
  };

  
  const handleEdit = (id, currentTitle) => {
    const newTitle = prompt("Edit Task Title:", currentTitle);
    if (newTitle && newTitle.trim() !== "") {
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, title: newTitle } : task
      ));
    }
  };

  const handleToggleComplete = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" ? true : 
                          statusFilter === "completed" ? t.completed : !t.completed;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchTerm, statusFilter]);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden font-sans">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                    <ListTodo className="text-white" size={28} />
                </div>
                Project Tasks
              </h1>
              <p className="text-slate-500 font-medium mt-1">Manage and monitor team productivity in real-time.</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Quick search tasks..." 
                  className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-[1.2rem] outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 w-72 text-sm transition-all shadow-sm"
                />
              </div>

              <div className="flex bg-white border border-slate-200 p-1 rounded-[1.2rem] shadow-sm">
                 {["all", "pending", "completed"].map((f) => (
                    <button
                        key={f}
                        onClick={() => {setStatusFilter(f); setCurrentPage(1);}}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all capitalize ${
                            statusFilter === f ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-800"
                        }`}
                    >
                        {f}
                    </button>
                 ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Task Information</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Assigned To</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Due Date</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence mode="popLayout">
                    {currentTasks.map((t, index) => (
                      <motion.tr 
                        key={t.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="group hover:bg-blue-50/30 transition-all cursor-default"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => handleToggleComplete(t.id)}
                              className={`transition-transform active:scale-90 ${t.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-blue-500'}`}
                            >
                              {t.completed ? <CheckCircle2 size={22} fill="currentColor" className="text-white fill-emerald-500" /> : <Circle size={22} />}
                            </button>
                            <span className={`text-sm font-bold tracking-tight transition-all ${t.completed ? 'text-slate-400 line-through decoration-emerald-500/50' : 'text-slate-700'}`}>
                              {t.title}
                            </span>
                          </div>
                        </td>

                        <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-[10px] font-black">
                                    {t.assignedTo.charAt(0)}
                                </div>
                                <span className="text-xs font-bold text-slate-600">{t.assignedTo}</span>
                            </div>
                        </td>

                        <td className="px-8 py-5">
                            <div className="flex items-center gap-2 text-slate-500">
                                <Calendar size={14} />
                                <span className="text-xs font-bold">{t.dueDate}</span>
                            </div>
                        </td>

                        <td className="px-8 py-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                            t.completed 
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                              : 'bg-amber-50 text-amber-600 border border-amber-100'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${t.completed ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            {t.completed ? "Completed" : "Pending"}
                          </span>
                        </td>

                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEdit(t.id, t.title)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            >
                                <Edit3 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(t.id)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            <div className="p-8 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center bg-white gap-4">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Showing {currentTasks.length} of {filteredTasks.length} results
              </p>
              
              <div className="flex items-center gap-3">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 disabled:opacity-30 hover:border-blue-500 transition-all shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="flex gap-1">
                   {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-9 h-9 text-xs font-black rounded-xl transition-all ${
                            currentPage === i + 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-400 hover:bg-slate-100"
                        }`}
                      >
                        {i + 1}
                      </button>
                   ))}
                </div>

                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 disabled:opacity-30 hover:border-blue-500 transition-all shadow-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}