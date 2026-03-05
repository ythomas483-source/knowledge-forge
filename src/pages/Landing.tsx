import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, Users, Eye, Brain, Sparkles, Database, Building2, Server, Monitor, ArrowRight, Globe } from "lucide-react";
import { useLanguage, type Locale } from "@/contexts/LanguageContext";

const locales: { code: Locale; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "it", label: "IT" },
  { code: "de", label: "DE" },
  { code: "en", label: "EN" },
];

const SwissCross = () => (
  <svg viewBox="0 0 32 32" className="w-6 h-6" aria-label="Swiss cross">
    <rect width="32" height="32" rx="4" fill="hsl(0 72% 51%)" />
    <rect x="13" y="6" width="6" height="20" rx="1" fill="white" />
    <rect x="6" y="13" width="20" height="6" rx="1" fill="white" />
  </svg>
);

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Landing = () => {
  const navigate = useNavigate();
  const { locale, setLocale, t } = useLanguage();

  const selectRole = (role: "admin" | "user" | "guest") => {
    navigate(`/login?role=${role}`);
  };

  const roles = [
    {
      key: "admin" as const,
      icon: Shield,
      titleKey: "admin_title",
      descKey: "admin_desc",
      gradient: "from-primary to-primary/70",
      border: "border-primary/30",
    },
    {
      key: "user" as const,
      icon: Users,
      titleKey: "user_title",
      descKey: "user_desc",
      gradient: "from-accent to-accent/70",
      border: "border-accent/30",
    },
    {
      key: "guest" as const,
      icon: Eye,
      titleKey: "guest_title",
      descKey: "guest_desc",
      gradient: "from-muted-foreground to-muted-foreground/70",
      border: "border-muted-foreground/30",
    },
  ];

  const features = [
    { icon: Sparkles, key: "feat_ai" },
    { icon: Database, key: "feat_rag" },
    { icon: Building2, key: "feat_tenant" },
    { icon: Globe, key: "feat_swiss" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-lg font-bold text-foreground tracking-tight">LearnForge</span>
            <span className="text-[10px] block text-muted-foreground -mt-0.5 font-medium">{t("hero_title")}</span>
          </div>
        </div>
        {/* Language switcher */}
        <div className="flex items-center gap-1 bg-muted/60 rounded-full px-1 py-1">
          {locales.map((l) => (
            <button
              key={l.code}
              onClick={() => setLocale(l.code)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                locale === l.code
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </button>
          ))}
          <SwissCross />
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 py-8 lg:py-16 space-y-16">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl lg:text-6xl font-extrabold text-foreground tracking-tight">
            Learn<span className="text-primary">Forge</span>
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("hero_subtitle")}
          </p>
        </motion.section>

        {/* RBAC Section */}
        <motion.section variants={container} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={item} className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">{t("select_role")}</h2>
            <p className="text-xs font-mono text-muted-foreground bg-muted inline-block px-3 py-1 rounded-full">
              {t("rbac")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((r) => (
              <motion.button
                key={r.key}
                variants={item}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => selectRole(r.key)}
                className={`glass-card rounded-2xl p-8 text-left border ${r.border} hover:shadow-xl transition-shadow group cursor-pointer`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${r.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <r.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{t(r.titleKey)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{t(r.descKey)}</p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                  {t("enter")} <ArrowRight className="w-4 h-4" />
                </span>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Feature strip */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {features.map((f) => (
            <div key={f.key} className="flex items-center gap-2 bg-muted/50 rounded-full px-5 py-2.5">
              <f.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{t(f.key)}</span>
            </div>
          ))}
        </motion.section>

        {/* Architecture section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-bold text-foreground text-center">{t("arch_title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-xl p-6 border border-primary/20">
              <div className="flex items-center gap-3 mb-3">
                <Monitor className="w-6 h-6 text-primary" />
                <h3 className="font-bold text-foreground">{t("arch_client")}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("arch_client_desc")}</p>
              <div className="flex gap-2 mt-4">
                {["React", "Vite", "Tailwind"].map((tech) => (
                  <span key={tech} className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{tech}</span>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-xl p-6 border border-accent/20">
              <div className="flex items-center gap-3 mb-3">
                <Server className="w-6 h-6 text-accent-foreground" />
                <h3 className="font-bold text-foreground">{t("arch_server")}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("arch_server_desc")}</p>
              <div className="flex gap-2 mt-4">
                {["Infomaniak", "Ubuntu", "pgvector"].map((tech) => (
                  <span key={tech} className="text-[10px] font-bold bg-accent/10 text-accent-foreground px-2 py-0.5 rounded-full">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center space-y-3 pb-8"
        >
          <div className="flex items-center justify-center gap-2">
            <SwissCross />
            <span className="text-sm font-semibold text-muted-foreground">{t("footer")}</span>
          </div>
          <p className="text-xs text-muted-foreground">FR · IT · DE · EN</p>
        </motion.footer>
      </main>
    </div>
  );
};

export default Landing;
