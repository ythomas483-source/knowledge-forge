import { createContext, useContext, useState, ReactNode } from "react";

type Role = "admin" | "user";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<Role>("user");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setRole = (r: Role) => {
    setRoleState(r);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setRoleState("guest");
    setIsAuthenticated(false);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, isAuthenticated, logout }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
};
