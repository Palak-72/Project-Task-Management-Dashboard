import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Calendar, Flag, User, Tag, Clock, Link as LinkIcon, AlignLeft } from "lucide-react";

export default function AddModal({ onClose, onAdd, editData }) {
  const [formData, setFormData] = useState({
    title: "",
    type: "task",
    description: "",
    priority: "Medium",
    status: "To Do",
    dueDate: "",
    assignee: "",
    estimatedHours: "",
    tags: "",
    attachment: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || editData.name || "",
        type: editData.type || (editData.name ? "project" : "task"),
        description: editData.description || "",
        priority: editData.priority || "Medium",
        status: editData.status || "To Do",
        dueDate: editData.dueDate || "",
        assignee: editData.assignee || "",
        estimatedHours: editData.estimatedHours || "",
        tags: editData.tags || "",
        attachment: editData.attachment || ""
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
   
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  
  const validate = () => {
    let newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.dueDate) newErrors.dueDate = "Selection of date is mandatory";
    if (!formData.assignee.trim()) newErrors.assignee = "Please assign a person";
    if (!formData.tags.trim()) newErrors.tags = "Add at least one tag";
    
    
    if (!formData.estimatedHours) {
      newErrors.estimatedHours = "Hours are required";
    } else if (formData.estimatedHours <= 0) {
      newErrors.estimatedHours = "Must be greater than 0";
    }

   
    if (formData.attachment && !formData.attachment.startsWith("http")) {
      newErrors.attachment = "Invalid URL (must start with http/https)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onAdd(formData);
      onClose();
    }
  };

  const ErrorMsg = ({ name }) => (
    errors[name] ? <p className="text-red-500 text-[10px] font-bold mt-1 px-1 tracking-wide uppercase italic">{errors[name]}</p> : null
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" 
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 custom-scrollbar"
      >
        <div className="sticky top-0 bg-blue-600 flex items-center justify-between p-5 border-b border-blue-700 z-20">
          <h2 className="text-xl font-bold text-white">{editData ? "Update Details" : "Add New Item"}</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Title*</label>
              <input name="title" value={formData.title} onChange={handleChange}
                placeholder="Ex: API Integration" className={`w-full border rounded-xl p-2.5 bg-gray-50 outline-none transition-all ${errors.title ? 'border-red-500 ring-1 ring-red-200' : 'border-gray-200 focus:border-blue-500'}`} />
              <ErrorMsg name="title" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full border border-gray-200 rounded-xl p-2.5 bg-gray-50">
                <option value="task">Task</option>
                <option value="project">Project</option>
              </select>
            </div>
          </div>

          {}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1 flex items-center gap-2"><AlignLeft size={16}/> Description*</label>
            <textarea name="description" rows="2" value={formData.description} onChange={handleChange}
              placeholder="What needs to be done?" className={`w-full border rounded-xl p-2.5 bg-gray-50 outline-none transition-all ${errors.description ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'}`} />
            <ErrorMsg name="description" />
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 flex items-center gap-2"><Flag size={16}/> Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="w-full border border-gray-200 rounded-xl p-2.5 bg-gray-50">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-200 rounded-xl p-2.5 bg-gray-50">
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 flex items-center gap-2"><Calendar size={16}/> Due Date*</label>
              <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} 
                className={`w-full border rounded-xl p-2.5 bg-gray-50 outline-none ${errors.dueDate ? 'border-red-500' : 'border-gray-200'}`} />
              <ErrorMsg name="dueDate" />
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 flex items-center gap-2"><User size={16}/> Assigned To*</label>
              <input name="assignee" value={formData.assignee} onChange={handleChange} placeholder="Full Name" 
                className={`w-full border rounded-xl p-2.5 bg-gray-50 outline-none ${errors.assignee ? 'border-red-500' : 'border-gray-200'}`} />
              <ErrorMsg name="assignee" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 flex items-center gap-2"><Clock size={16}/> Estimated Hours*</label>
              <input type="number" name="estimatedHours" value={formData.estimatedHours} onChange={handleChange} placeholder="e.g. 8" 
                className={`w-full border rounded-xl p-2.5 bg-gray-50 outline-none ${errors.estimatedHours ? 'border-red-500' : 'border-gray-200'}`} />
              <ErrorMsg name="estimatedHours" />
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 flex items-center gap-2"><Tag size={16}/> Tags*</label>
              <input name="tags" value={formData.tags} onChange={handleChange} placeholder="UI, Backend, Urgent" 
                className={`w-full border rounded-xl p-2.5 bg-gray-50 outline-none ${errors.tags ? 'border-red-500' : 'border-gray-200'}`} />
              <ErrorMsg name="tags" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 flex items-center gap-2"><LinkIcon size={16}/> Attachment URL</label>
              <input name="attachment" value={formData.attachment} onChange={handleChange} placeholder="https://resource.com" 
                className={`w-full border rounded-xl p-2.5 bg-gray-50 outline-none ${errors.attachment ? 'border-red-500' : 'border-gray-200'}`} />
              <ErrorMsg name="attachment" />
            </div>
          </div>

          <div className="flex gap-3 pt-6 sticky bottom-0 bg-white border-t border-gray-50">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all">Cancel</button>
            <button type="submit" className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">
               {editData ? "Update Task" : "Confirm & Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}