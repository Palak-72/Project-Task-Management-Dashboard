import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([
    { id: 1, name: "Ecommerce", description: "MERN Stack project", status: "Active", tasks: 10 },
    { id: 2, name: "Portfolio", description: "Personal branding site", status: "Completed", tasks: 5 },
  ]);

  return (
   
    <AppContext.Provider value={{ tasks, setTasks, projects, setProjects }}>
      {children}
    </AppContext.Provider>
  );
};