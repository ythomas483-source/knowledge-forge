import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Shield, Users, Eye, Brain, Lock, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRole } from "@/contexts/RoleContext";
import { useLanguage } from "@/contexts/LanguageContext";

const roleConfig = {
  admin: { icon: Shield, gradient: "from-primary to-primary/70", label: "admin_title" },
  user: { icon: Users, gradient: "from-accent to-accent/70", label: "user_title" },
  guest: { icon: Eye, gradient: "from-muted-foreground to-muted-foreground/70", label: "guest_title" },
} as const;

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setRole } = useRole();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const roleParam = (searchParams.get("role") || "guest") as "admin" | "user" | "guest";
  const config = roleConfig[roleParam];
  const RoleIcon = config.icon;
  const isGuest = roleParam === "guest";

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    setRole(roleParam);
    navigate("/dashboard");
  };

  // Guest auto-flow: just show a button, no form
  useEffect(() => {
    // no auto-redirect, let them click
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Back link */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("login_back")}
        </button>

        <div className="glass-card rounded-2xl p-8 border border-border space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">LearnForge</span>
            </div>

            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center mx-auto`}>
              <RoleIcon className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t("login_title")}</h1>
              <p className="text-sm text-muted-foreground mt-1">{t(config.label)}</p>
            </div>
          </div>

          {isGuest ? (
            /* Guest: no form, just a button */
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">{t("login_guest_info")}</p>
              <Button
                onClick={() => handleLogin()}
                className="w-full gradient-primary text-primary-foreground font-semibold h-12"
              >
                {t("login_guest_continue")}
              </Button>
            </div>
          ) : (
            /* Admin / User: login form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t("login_email")}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="nom@entreprise.ch"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t("login_password")}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full gradient-primary text-primary-foreground font-semibold h-12"
              >
                {t("login_submit")}
              </Button>
            </form>
          )}

          {/* RBAC badge */}
          <p className="text-[10px] font-mono text-center text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {t("rbac")}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
