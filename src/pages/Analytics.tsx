import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { BarChart3, Users, Clock, TrendingUp, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const serviceStats = [
  { service: "IT", completion: 82, avgScore: 88, activeUsers: 32, formations: 4 },
  { service: "Sales", completion: 65, avgScore: 76, activeUsers: 18, formations: 3 },
  { service: "Compliance", completion: 94, avgScore: 91, activeUsers: 120, formations: 2 },
  { service: "RH", completion: 45, avgScore: 72, activeUsers: 8, formations: 3 },
];

const serviceBadgeColors: Record<string, string> = {
  IT: "bg-info/10 text-info",
  Sales: "bg-accent/10 text-accent-foreground",
  Compliance: "bg-success/10 text-success",
  RH: "bg-primary/10 text-primary",
};

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Performance et suivi des compétences</p>
        </motion.div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Taux de complétion" value="74%" change="+8%" changeType="positive" icon={Target} color="primary" />
          <StatCard title="Temps moyen" value="4h 32m" change="-12min" changeType="positive" icon={Clock} color="accent" />
          <StatCard title="Utilisateurs actifs" value={178} change="+22" changeType="positive" icon={Users} color="info" />
          <StatCard title="Progression globale" value="+15%" change="vs trimestre" changeType="positive" icon={TrendingUp} color="success" />
        </div>

        {/* Per-Service Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-5">Performance par service</h2>
          <div className="space-y-5">
            {serviceStats.map((s, i) => (
              <motion.div
                key={s.service}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-4"
              >
                <span className={`text-xs font-bold px-3 py-1 rounded-full w-24 text-center ${serviceBadgeColors[s.service]}`}>
                  {s.service}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Complétion</span>
                    <span className="text-sm font-semibold text-foreground">{s.completion}%</span>
                  </div>
                  <Progress value={s.completion} className="h-2" />
                </div>
                <div className="text-right w-20">
                  <div className="text-sm font-bold text-foreground">{s.avgScore}%</div>
                  <div className="text-xs text-muted-foreground">score moy.</div>
                </div>
                <div className="text-right w-16">
                  <div className="text-sm font-bold text-foreground">{s.activeUsers}</div>
                  <div className="text-xs text-muted-foreground">actifs</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skills Heatmap placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-xl p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-3">Cartographie des compétences</h2>
          <p className="text-sm text-muted-foreground mb-5">Détection automatique des lacunes par service</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { skill: "Sécurité réseau", level: 85 },
              { skill: "RGPD", level: 92 },
              { skill: "Process vente", level: 68 },
              { skill: "Recrutement", level: 45 },
              { skill: "Cloud AWS", level: 30 },
              { skill: "Gestion incidents", level: 78 },
              { skill: "Négociation", level: 55 },
              { skill: "Onboarding", level: 72 },
            ].map((s) => (
              <div
                key={s.skill}
                className={`p-3 rounded-lg text-center border transition-colors ${
                  s.level >= 80 ? "bg-success/5 border-success/20" :
                  s.level >= 60 ? "bg-accent/5 border-accent/20" :
                  "bg-destructive/5 border-destructive/20"
                }`}
              >
                <div className={`text-lg font-bold ${
                  s.level >= 80 ? "text-success" : s.level >= 60 ? "text-accent" : "text-destructive"
                }`}>
                  {s.level}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">{s.skill}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
