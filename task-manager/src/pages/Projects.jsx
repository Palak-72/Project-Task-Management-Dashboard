import { useContext, useState, useMemo } from "react";
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, Search, Plus, Trash2, Edit3, Layers 
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AddModal from "../components/addModel";

export default function Projects() {
  const { projects, setProjects, setTasks, tasks } = useContext(AppContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const handleAdd = (item) => {
    const newId = Date.now();
    if (item.type === "task") {
      setTasks(prev => [{ id: newId, title: item.title, completed: false }, ...prev]);
    } else if (item.type === "project") {
      setProjects(prev => [{ 
        id: newId, 
        name: item.title, 
        description: item.description || "New project created", 
        status: "Active", 
        tasks: 0 
      }, ...prev]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" ? true : p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden font-sans text-slate-900">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          
   
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight">Project Directory</h1>
              <p className="text-slate-500 font-medium mt-1">Manage and track your initiatives.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-3 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search project..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 w-64 text-sm shadow-sm transition-all" 
                />
              </div>

              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 outline-none shadow-sm cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-100 font-bold"
              >
                <Plus size={20} /> Add New
              </motion.button>
            </div>
          </div>

       
          <div className="hidden md:grid grid-cols-12 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <div className="col-span-4">Project Details</div>
            <div className="col-span-3 text-center">Description</div>
            <div className="col-span-2 text-center">Tasks</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

    
          <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((p) => {
                const taskCount = tasks.filter(t => t.projectId === p.id).length;

                return (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl border border-slate-100 p-4 md:px-8 shadow-sm hover:shadow-md transition-all grid grid-cols-1 md:grid-cols-12 items-center gap-4 group"
                  >
                 
                    <div className="col-span-1 md:col-span-4 flex items-center gap-4 min-w-0">
                      <div className="bg-slate-50 p-2.5 rounded-xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner shrink-0">
                        <Briefcase size={20} />
                      </div>
                      <h2 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                        {p.name}
                      </h2>
                    </div>

                    <div className="col-span-1 md:col-span-3 text-center">
                      <span className="md:hidden text-[10px] font-bold text-slate-400 block mb-1">DESCRIPTION</span>
                      <p className="text-sm font-bold text-slate-600 truncate px-2">
                        {p.description || "---"}
                      </p>
                    </div>

                    {/* Tasks */}
                    <div className="col-span-1 md:col-span-2 text-center">
                      <span className="md:hidden text-[10px] font-bold text-slate-400 block mb-1">TASKS</span>
                      <div className="inline-flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg">
                        <Layers size={14} className="text-slate-400" />
                        <span className="text-sm font-bold text-slate-700">{p.tasks || taskCount}</span>
                      </div>
                    </div>

          
                    <div className="col-span-1 md:col-span-2 text-center">
                      <span className="md:hidden text-[10px] font-bold text-slate-400 block mb-1">STATUS</span>
                      <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tighter ${
                        p.status === 'Completed' 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-blue-50 text-blue-600'
                      }`}>
                        {p.status}
                      </span>
                    </div>

                    <div className="col-span-1 md:col-span-1 flex items-center justify-end gap-1">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Edit3 size={17} />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredProjects.length === 0 && (
              <div className="p-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold">No projects found matching your criteria.</p>
              </div>
            )}
          </div>

          <AnimatePresence>
            {showModal && <AddModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}