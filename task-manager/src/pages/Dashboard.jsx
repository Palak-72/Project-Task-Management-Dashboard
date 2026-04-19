import { useContext, useState, useEffect, useMemo } from "react";
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Filter, Layout, CheckCircle, Clock, 
  BarChart3, Briefcase, Trash2, Edit3, PieChart as PieIcon, Flag 
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AddModal from "../components/addModel";
import Loader from "../components/Loader";

export default function Dashboard() {
  const { tasks, setTasks, projects, setProjects } = useContext(AppContext);
  const [search, setSearch] = useState(""); 
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

 
  const completedTasks = tasks.filter(t => t.status === "Completed").length;
  const inProgressTasks = tasks.filter(t => t.status === "In Progress" || t.status === "Review").length;
  const pendingTasks = tasks.length - completedTasks - inProgressTasks;
  const totalProjects = projects.length;


  const priorityGraphData = useMemo(() => {
    const allItems = [...tasks, ...projects];
    return [
      { name: 'High', value: allItems.filter(i => i.priority === "High").length, color: '#ef4444' },
      { name: 'Medium', value: allItems.filter(i => i.priority === "Medium").length, color: '#f59e0b' },
      { name: 'Low', value: allItems.filter(i => i.priority === "Low" || !i.priority).length, color: '#3b82f6' },
    ];
  }, [tasks, projects]);

  const pieData = [
    { name: 'Completed', value: completedTasks, color: '#10b981' },
    { name: 'Progress', value: inProgressTasks, color: '#f97316' },
    { name: 'Pending', value: pendingTasks > 0 ? pendingTasks : 0, color: '#ef4444' },
  ];

  
  
  const recentActivity = useMemo(() => {
    const combined = [
      ...projects.map(p => ({ ...p, type: 'Project', title: p.name, status: p.status || 'Active', date: p.date || 'Today' })),
      ...tasks.map(t => ({ ...t, type: 'Task', title: t.title, status: t.status || 'Pending', date: t.date || 'Today' }))
    ];
    

    const filtered = combined.filter(item => 
      item.title.toLowerCase().includes(search.toLowerCase())
    );

    return filtered.sort((a, b) => b.id - a.id).slice(0, 5);
  }, [tasks, projects, search]);

  const handleAdd = (item) => {
    const newId = Date.now();
    const today = new Date().toLocaleDateString();
    
    if (item.type === "task") {
      setTasks(prev => [{ 
        id: newId, 
        title: item.title, 
        status: item.status || "To Do",
        priority: item.priority || "Low",
        date: today, 
        description: item.description || "Standard workflow task" 
      }, ...prev]);
    } else if (item.type === "project") {
      setProjects(prev => [{ 
        id: newId, 
        name: item.title, 
        status: "Active",
        priority: item.priority || "Low",
        date: today, 
        description: item.description || "Core development project" 
      }, ...prev]);
    }
    setShowModal(false);
  };

  const handleDelete = (id, type) => {
    if (type === 'Project') setProjects(prev => prev.filter(p => p.id !== id));
    else setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleEdit = (item) => {
    alert(`Edit feature for ${item.title} coming soon!`);
  };

  if (isLoading) return <div className="h-screen w-full flex items-center justify-center bg-gray-50"><Loader /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-screen bg-slate-50 flex flex-col overflow-hidden font-sans text-slate-900">
     <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-950 tracking-tight">Dashboard</h1>
              <p className="text-slate-500 font-medium">Real-time performance metrics and task distribution.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-xl shadow-slate-200 font-bold"
            >
              <Plus size={20} /> Create New
            </motion.button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard title="Total Projects" value={totalProjects} icon={<Briefcase />} color="bg-purple-50 text-purple-600" />
            <StatsCard title="Total Tasks" value={tasks.length} icon={<Layout />} color="bg-blue-50 text-blue-600" />
            <StatsCard title="Completed" value={completedTasks} icon={<CheckCircle />} color="bg-emerald-50 text-emerald-600" />
            <StatsCard title="Pending" value={pendingTasks > 0 ? pendingTasks : 0} icon={<Clock />} color="bg-amber-50 text-amber-600" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {}
            <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-5">
                <div className="p-3 bg-red-50 rounded-xl text-red-600 shadow-inner">
                  <Flag size={22}/>
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Priority Statistics</h2>
                    <p className="text-xs text-slate-400 font-medium">Breakdown by High, Medium, and Low urgency.</p>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityGraphData} barGap={10}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={65}>
                      {priorityGraphData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center">
              <div className="flex items-center gap-3 mb-6 self-start w-full border-b border-slate-50 pb-5">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shadow-inner">
                  <PieIcon size={22}/>
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Status Distribution</h2>
                    <p className="text-xs text-slate-400 font-medium">Real-time status breakdown.</p>
                </div>
              </div>
              <div className="h-[220px] w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value" cornerRadius={8}>
                      {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-slate-950">{tasks.length}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-6 w-full pt-5 border-t border-slate-50">
                {pieData.map(d => (
                  <div key={d.name} className="flex flex-col items-center p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: d.color}} />
                      <span className="text-sm font-black text-slate-900">{d.value}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-7 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity Feed</h2>
              
              {}
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by name..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="p-5 text-[11px] font-black uppercase text-slate-400 tracking-widest">Name / Title</th>
                    <th className="p-5 text-[11px] font-black uppercase text-slate-400 tracking-widest">Entity</th>
                    <th className="p-5 text-[11px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                    <th className="p-5 text-[11px] font-black uppercase text-slate-400 tracking-widest">Date</th>
                    <th className="p-5 text-[11px] font-black uppercase text-slate-400 tracking-widest text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence mode="popLayout">
                    {recentActivity.map((item) => (
                      <motion.tr 
                        key={item.id} layout initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="p-5 font-bold text-slate-800">{item.title}</td>
                        <td className="p-5 text-sm text-slate-500 font-medium">{item.type}</td>
                        <td className="p-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                            item.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : item.status === 'Active' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-5 text-sm text-slate-500 font-medium">{item.date}</td>
                        <td className="p-5">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl"><Edit3 size={17}/></button>
                            <button onClick={() => handleDelete(item.id, item.type)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"><Trash2 size={17}/></button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {recentActivity.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-10 text-center text-slate-400 font-medium">No results found for "{search}"</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {showModal && <AddModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
      </AnimatePresence>
    </motion.div>
  );
}

function StatsCard({ title, value, icon, color }) {
  return (
    <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-inner`}>{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1.5">{title}</p>
        <p className="text-3xl font-black text-slate-950 leading-none tracking-tight">{value}</p>
      </div>
    </motion.div>
  );
}