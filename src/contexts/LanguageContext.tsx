import { createContext, useContext, useState, ReactNode } from "react";

export type Locale = "fr" | "it" | "de" | "en";

const translations: Record<Locale, Record<string, string>> = {
  fr: {
    hero_title: "Knowledge-to-Learning Engine",
    hero_subtitle: "Transformez votre documentation interne en formations intelligentes",
    select_role: "Choisissez votre profil",
    rbac: "RBAC – Contrôle d'accès basé sur les rôles",
    admin_title: "Administrateur",
    admin_desc: "Créez des formations, définissez les sources, gérez les accès",
    user_title: "Collaborateur",
    user_desc: "Suivez vos formations, personnalisez vos objectifs, jeux de rôle",
    guest_title: "Invité",
    guest_desc: "Découvrez la plateforme en mode démo",
    enter: "Accéder",
    feat_ai: "Génération IA",
    feat_rag: "Moteur RAG",
    feat_tenant: "Multi-tenant",
    feat_swiss: "Hébergement Suisse",
    arch_title: "Architecture Client / Serveur",
    arch_client: "Client (Frontend)",
    arch_client_desc: "React + Vite exécuté dans le navigateur de l'utilisateur. Interface d'interaction avec l'IA.",
    arch_server: "Serveur (Backend)",
    arch_server_desc: "Hébergé chez Infomaniak (Suisse), Ubuntu Server, API sécurisée, moteur RAG.",
    footer: "Conçu en Suisse",
  },
  it: {
    hero_title: "Knowledge-to-Learning Engine",
    hero_subtitle: "Trasforma la documentazione interna in formazioni intelligenti",
    select_role: "Scegli il tuo profilo",
    rbac: "RBAC – Controllo degli accessi basato sui ruoli",
    admin_title: "Amministratore",
    admin_desc: "Crea formazioni, definisci le fonti, gestisci gli accessi",
    user_title: "Collaboratore",
    user_desc: "Segui le formazioni, personalizza i tuoi obiettivi, giochi di ruolo",
    guest_title: "Ospite",
    guest_desc: "Scopri la piattaforma in modalità demo",
    enter: "Accedi",
    feat_ai: "Generazione IA",
    feat_rag: "Motore RAG",
    feat_tenant: "Multi-tenant",
    feat_swiss: "Hosting Svizzera",
    arch_title: "Architettura Client / Server",
    arch_client: "Client (Frontend)",
    arch_client_desc: "React + Vite eseguito nel browser dell'utente. Interfaccia di interazione con l'IA.",
    arch_server: "Server (Backend)",
    arch_server_desc: "Ospitato da Infomaniak (Svizzera), Ubuntu Server, API sicura, motore RAG.",
    footer: "Progettato in Svizzera",
  },
  de: {
    hero_title: "Knowledge-to-Learning Engine",
    hero_subtitle: "Verwandeln Sie Ihre interne Dokumentation in intelligente Schulungen",
    select_role: "Wählen Sie Ihr Profil",
    rbac: "RBAC – Rollenbasierte Zugriffskontrolle",
    admin_title: "Administrator",
    admin_desc: "Schulungen erstellen, Quellen definieren, Zugriffe verwalten",
    user_title: "Mitarbeiter",
    user_desc: "Schulungen verfolgen, Ziele personalisieren, Rollenspiele",
    guest_title: "Gast",
    guest_desc: "Plattform im Demo-Modus entdecken",
    enter: "Zugreifen",
    feat_ai: "KI-Generierung",
    feat_rag: "RAG-Engine",
    feat_tenant: "Multi-Tenant",
    feat_swiss: "Schweizer Hosting",
    arch_title: "Client / Server Architektur",
    arch_client: "Client (Frontend)",
    arch_client_desc: "React + Vite im Browser des Benutzers. Interaktionsschnittstelle mit KI.",
    arch_server: "Server (Backend)",
    arch_server_desc: "Gehostet bei Infomaniak (Schweiz), Ubuntu Server, sichere API, RAG-Engine.",
    footer: "Entwickelt in der Schweiz",
  },
  en: {
    hero_title: "Knowledge-to-Learning Engine",
    hero_subtitle: "Transform your internal documentation into intelligent training",
    select_role: "Choose your profile",
    rbac: "RBAC – Role-Based Access Control",
    admin_title: "Administrator",
    admin_desc: "Create training, define sources, manage access",
    user_title: "Collaborator",
    user_desc: "Follow your training, customize your goals, roleplay",
    guest_title: "Guest",
    guest_desc: "Discover the platform in demo mode",
    enter: "Enter",
    feat_ai: "AI Generation",
    feat_rag: "RAG Engine",
    feat_tenant: "Multi-tenant",
    feat_swiss: "Swiss Hosting",
    arch_title: "Client / Server Architecture",
    arch_client: "Client (Frontend)",
    arch_client_desc: "React + Vite running in the user's browser. AI interaction interface.",
    arch_server: "Server (Backend)",
    arch_server_desc: "Hosted by Infomaniak (Switzerland), Ubuntu Server, secure API, RAG engine.",
    footer: "Made in Switzerland",
  },
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>("fr");
  const t = (key: string) => translations[locale]?.[key] ?? key;
  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
