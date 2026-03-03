import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { BookOpen, Clock, Users, ChevronRight, Plus, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const formations = [
  {
    id: 1,
    title: "Sécurité Réseau – Interne",
    service: "IT",
    modules: 4,
    participants: 32,
    progress: 78,
    status: "active",
    generatedAt: "12 jan 2025",
    description: "Parcours généré automatiquement à partir de la documentation réseau interne.",
  },
  {
    id: 2,
    title: "Onboarding Commercial Q1",
    service: "Sales",
    modules: 6,
    participants: 18,
    progress: 45,
    status: "active",
    generatedAt: "5 jan 2025",
    description: "Formation d'intégration pour les nouveaux commerciaux, basée sur les process de vente.",
  },
  {
    id: 3,
    title: "RGPD & Conformité 2024",
    service: "Compliance",
    modules: 3,
    participants: 120,
    progress: 92,
    status: "active",
    generatedAt: "20 déc 2024",
    description: "Formation obligatoire sur la protection des données et la conformité réglementaire.",
  },
  {
    id: 4,
    title: "Process RH – Recrutement",
    service: "RH",
    modules: 5,
    participants: 8,
    progress: 34,
    status: "draft",
    generatedAt: "8 jan 2025",
    description: "Guide complet des procédures de recrutement interne, de la candidature à l'intégration.",
  },
  {
    id: 5,
    title: "Architecture Cloud AWS",
    service: "IT",
    modules: 8,
    participants: 15,
    progress: 12,
    status: "draft",
    generatedAt: "15 jan 2025",
    description: "Bonnes pratiques d'architecture cloud et migration des services internes.",
  },
];

const serviceBadgeColors: Record<string, string> = {
  IT: "bg-info/10 text-info",
  Sales: "bg-accent/10 text-accent-foreground",
  Compliance: "bg-success/10 text-success",
  RH: "bg-primary/10 text-primary",
};

const statusLabels: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-success/10 text-success" },
  draft: { label: "Brouillon", className: "bg-muted text-muted-foreground" },
};

const Formations = () => {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Formations</h1>
            <p className="text-muted-foreground mt-1">
              Parcours générés automatiquement par l'IA
            </p>
          </div>
          <Button className="gradient-primary text-primary-foreground gap-2 shadow-md hover:shadow-lg transition-shadow">
            <Sparkles className="w-4 h-4" />
            Générer une formation
          </Button>
        </motion.div>

        {/* Formation Cards */}
        <div className="grid gap-4">
          {formations.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${serviceBadgeColors[f.service]}`}>
                      {f.service}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusLabels[f.status].className}`}>
                      {statusLabels[f.status].label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{f.description}</p>
                  <div className="flex items-center gap-6 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" /> {f.modules} modules
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {f.participants} participants
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {f.generatedAt}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-bold text-foreground">{f.progress}%</div>
                    <Progress value={f.progress} className="w-24 h-1.5 mt-1" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Formations;
