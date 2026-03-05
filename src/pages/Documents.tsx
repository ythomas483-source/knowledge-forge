import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { FileText, Upload, Search, Filter, File, FileSpreadsheet, Presentation, Download, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRole } from "@/contexts/RoleContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const documents = [
  { id: 1, name: "Politique_Securite_Reseau_v3.pdf", type: "PDF", service: "IT", size: "2.4 MB", indexed: true, chunks: 48, uploadedAt: "12 jan 2025" },
  { id: 2, name: "Guide_Commercial_2025.docx", type: "DOCX", service: "Sales", size: "1.8 MB", indexed: true, chunks: 35, uploadedAt: "10 jan 2025" },
  { id: 3, name: "Formation_RGPD.pptx", type: "PPTX", service: "Compliance", size: "5.2 MB", indexed: true, chunks: 62, uploadedAt: "8 jan 2025" },
  { id: 4, name: "Procedures_Recrutement.pdf", type: "PDF", service: "RH", size: "890 KB", indexed: true, chunks: 22, uploadedAt: "5 jan 2025" },
  { id: 5, name: "Architecture_Cloud_Interne.pdf", type: "PDF", service: "IT", size: "3.1 MB", indexed: false, chunks: 0, uploadedAt: "15 jan 2025" },
  { id: 6, name: "Process_Vente_B2B.docx", type: "DOCX", service: "Sales", size: "1.2 MB", indexed: true, chunks: 28, uploadedAt: "3 jan 2025" },
];

const typeIcons: Record<string, React.ElementType> = {
  PDF: FileText,
  DOCX: File,
  PPTX: Presentation,
  XLSX: FileSpreadsheet,
};

const serviceBadgeColors: Record<string, string> = {
  IT: "bg-info/10 text-info",
  Sales: "bg-accent/10 text-accent-foreground",
  Compliance: "bg-success/10 text-success",
  RH: "bg-primary/10 text-primary",
};

const Documents = () => {
  const { role } = useRole();
  const { t } = useLanguage();
  const isGuest = role === "guest";

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
            <h1 className="text-3xl font-bold text-foreground">Documents</h1>
            <p className="text-muted-foreground mt-1">
              Bibliothèque documentaire & base vectorielle
            </p>
          </div>
          {!isGuest && (
            <Button className="gradient-primary text-primary-foreground gap-2 shadow-md hover:shadow-lg transition-shadow">
              <Upload className="w-4 h-4" />
              Importer
            </Button>
          )}
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Rechercher un document..." className="pl-10" />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" /> Filtrer
          </Button>
        </motion.div>

        {/* Upload Zone (hidden for guests) */}
        {!isGuest && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer group"
          >
            <Upload className="w-10 h-10 mx-auto text-muted-foreground group-hover:text-primary transition-colors mb-3" />
            <p className="text-sm font-medium text-foreground">Glissez vos fichiers ici ou cliquez pour importer</p>
            <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, PPTX, Wiki — Max 50MB par fichier</p>
          </motion.div>
        )}

        {/* Documents Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Document</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Service</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Taille</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Chunks</th>
                   <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Statut</th>
                   <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                   <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, i) => {
                  const TypeIcon = typeIcons[doc.type] || FileText;
                  return (
                    <motion.tr
                      key={doc.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 + i * 0.05 }}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <TypeIcon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${serviceBadgeColors[doc.service]}`}>
                          {doc.service}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{doc.size}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{doc.chunks || "—"}</td>
                      <td className="py-3 px-4">
                        {doc.indexed ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-success/10 text-success">Indexé</span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-warning/10 text-warning animate-pulse-soft">En cours</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{doc.uploadedAt}</td>
                      <td className="py-3 px-4">
                        {isGuest ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground cursor-not-allowed">
                                <Lock className="w-3 h-3" /> {t("access_restricted")}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>{t("access_restricted")}</TooltipContent>
                          </Tooltip>
                        ) : (
                          <Button variant="ghost" size="sm" className="gap-1 text-xs h-7">
                            <Download className="w-3 h-3" /> {t("download")}
                          </Button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Documents;
