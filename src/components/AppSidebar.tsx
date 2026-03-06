import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useRole } from "@/contexts/RoleContext";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  ClipboardCheck,
  BarChart3,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Gamepad2,
  UserPlus,
} from "lucide-react";
import InviteDialog from "@/components/InviteDialog";


interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: "Tableau de bord", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Formations", icon: BookOpen, path: "/formations" },
  { label: "Documents", icon: FileText, path: "/documents" },
  { label: "Évaluations", icon: ClipboardCheck, path: "/evaluations" },
  { label: "Jeu de rôle", icon: Gamepad2, path: "/roleplay" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "Utilisateurs", icon: Users, path: "/users", adminOnly: true },
  { label: "Paramètres", icon: Settings, path: "/settings" },
];

const AppSidebar = () => {
  const { role } = useRole();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const filteredItems = navItems.filter(
    (item) => !item.adminOnly || role === "admin"
  );

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="gradient-dark flex flex-col h-screen sticky top-0 z-30 border-r border-sidebar-border sidebar-depth"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
          <span className="text-primary-foreground font-extrabold text-xs">LS</span>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <span className="text-lg font-bold tracking-tight">
                <span className="text-gradient-silver">Lumina</span>{" "}
                <span className="text-gradient-red">Swiss</span>
              </span>
              <span className="text-xs block text-sidebar-foreground -mt-1">
                Knowledge Engine
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-sidebar-primary active-glow"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-sidebar-primary" : ""}`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm font-medium overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Invite + Role Badge & Collapse */}
      <div className="px-3 pb-4 space-y-3 border-t border-sidebar-border pt-3">
        {/* Invite button */}
        <InviteDialog
          trigger={
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all duration-200 group cursor-pointer">
              <UserPlus className="w-5 h-5 flex-shrink-0 text-primary" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm font-medium overflow-hidden whitespace-nowrap"
                  >
                    Inviter
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          }
        />
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-2"
            >
              <Shield className="w-4 h-4 text-sidebar-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground">
                {role}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
};

export default AppSidebar;
