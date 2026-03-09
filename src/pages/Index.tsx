import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import InviteDialog from "@/components/InviteDialog";
import { usePermissions } from "@/hooks/usePermissions";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Users,
  BookOpen,
  FileText,
  Trophy,
  TrendingUp,
  Clock,
  Target,
  Zap,
  UserPlus,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const recentFormations = [
  { titleKey: "Sécurité Réseau – Interne", service: "IT", progress: 78, modules: 4 },
  { titleKey: "Onboarding Commercial Q1", service: "Sales", progress: 45, modules: 6 },
  { titleKey: "RGPD & Conformité 2024", service: "Compliance", progress: 92, modules: 3 },
  { titleKey: "Process RH – Recrutement", service: "RH", progress: 34, modules: 5 },
];

const recentActivities = [
  { user: "Marie D.", action: "a terminé le module 3", formation: "Sécurité Réseau", time: "il y a 12 min" },
  { user: "Thomas L.", action: "a obtenu 95% au QCM", formation: "RGPD & Conformité", time: "il y a 34 min" },
  { user: "Sophie M.", action: "a démarré la formation", formation: "Onboarding Commercial", time: "il y a 1h" },
  { user: "Lucas P.", action: "a complété un jeu de rôle", formation: "Process RH", time: "il y a 2h" },
];

const serviceBadgeColors: Record<string, string> = {
  IT: "bg-info/10 text-info",
  Sales: "bg-accent/10 text-accent-foreground",
  Compliance: "bg-success/10 text-success",
  RH: "bg-primary/10 text-primary",
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Index = () => {
  const { canViewActivity, canViewQuickActions, canInvite, canGenerateFormation, canViewAnalytics, isGuest } = usePermissions();
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-bold text-foreground">
            {t("dashboard_title")}
          </h1>
          <p className="text-muted-foreground">
            {isGuest ? t("dashboard_subtitle_guest") : t("dashboard_subtitle")}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div variants={item}>
            <StatCard title={t("stat_active_learners")} value={isGuest ? "—" : 248} change={isGuest ? "" : t("stat_change_month")} changeType="positive" icon={Users} color="primary" />
          </motion.div>
          <motion.div variants={item}>
            <StatCard title={t("stat_active_formations")} value={isGuest ? 2 : 16} change={isGuest ? t("stat_assigned") : t("stat_change_week")} changeType="positive" icon={BookOpen} color="accent" />
          </motion.div>
          <motion.div variants={item}>
            <StatCard title={t("stat_indexed_docs")} value={isGuest ? "—" : 342} change={isGuest ? "" : t("stat_new_docs")} changeType="neutral" icon={FileText} color="info" />
          </motion.div>
          <motion.div variants={item}>
            <StatCard title={t("stat_avg_score")} value="87%" change={isGuest ? "" : t("stat_vs_last_month")} changeType="positive" icon={Trophy} color="success" />
          </motion.div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formations en cours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`card-elevated rounded-xl p-6 ${canViewActivity ? "lg:col-span-2" : "lg:col-span-3"}`}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-foreground">{t("formations_in_progress")}</h2>
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                {recentFormations.length} {t("active")}
              </span>
            </div>
            <div className="space-y-4">
              {recentFormations.map((f, i) => (
                <motion.div
                  key={f.titleKey}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-all cursor-pointer group card-hover-lift"
                >
                  <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 icon-bounce">
                    <BookOpen className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-foreground truncate">{f.titleKey}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${serviceBadgeColors[f.service] || "bg-muted text-muted-foreground"}`}>
                        {f.service}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={f.progress} className="flex-1 h-1.5" />
                      <span className="text-xs text-muted-foreground font-medium w-10 text-right">{f.progress}%</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {f.modules} {t("modules")}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Activité récente — hidden for guests */}
          {canViewActivity && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card-elevated rounded-xl p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-5">{t("recent_activity")}</h2>
              <div className="space-y-4">
                {recentActivities.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-foreground">
                        <span className="font-semibold">{a.user}</span>{" "}
                        <span className="text-muted-foreground">{a.action}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {a.formation} · {a.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Quick Actions — hidden for guests */}
        {canViewQuickActions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {canGenerateFormation && (
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="card-elevated card-accent-left hover-ring rounded-xl p-5 text-left hover:shadow-lg transition-all group cursor-pointer"
                style={{ "--accent-gradient": "var(--gradient-primary)" } as React.CSSProperties}
              >
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center mb-3 icon-bounce">
                  <Target className="w-5 h-5 text-primary-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground">{t("quick_generate")}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t("quick_generate_desc")}</p>
              </motion.button>
            )}
            {canViewAnalytics && (
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="card-elevated card-accent-left hover-ring rounded-xl p-5 text-left hover:shadow-lg transition-all group cursor-pointer"
                style={{ "--accent-gradient": "var(--gradient-silver)" } as React.CSSProperties}
              >
                <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center mb-3 icon-bounce">
                  <TrendingUp className="w-5 h-5 text-primary-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground">{t("quick_analytics")}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t("quick_analytics_desc")}</p>
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="card-elevated card-accent-left hover-ring rounded-xl p-5 text-left hover:shadow-lg transition-all group cursor-pointer"
              style={{ "--accent-gradient": "linear-gradient(135deg, hsl(152 60% 42%), hsl(152 60% 32%))" } as React.CSSProperties}
            >
              <div className="w-10 h-10 rounded-lg bg-success flex items-center justify-center mb-3 icon-bounce">
                <Clock className="w-5 h-5 text-primary-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground">{t("quick_roleplay")}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t("quick_roleplay_desc")}</p>
            </motion.button>
            {canInvite && (
              <InviteDialog
                trigger={
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="card-elevated card-accent-left hover-ring rounded-xl p-5 text-left hover:shadow-lg transition-all group cursor-pointer"
                    style={{ "--accent-gradient": "var(--gradient-primary)" } as React.CSSProperties}
                  >
                    <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center mb-3 icon-bounce">
                      <UserPlus className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{t("quick_invite")}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t("quick_invite_desc")}</p>
                  </motion.button>
                }
              />
            )}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Index;