
## Ajouter un bouton de déconnexion dans la sidebar

### Modifications

**1. `src/contexts/LanguageContext.tsx`** — Ajouter la clé `nav_logout` dans les 5 langues :
- FR: "Déconnexion", EN: "Log out", DE: "Abmelden", IT: "Disconnetti", RM: "Deconnectar"

**2. `src/components/AppSidebar.tsx`** — Ajouter un bouton déconnexion dans la zone basse de la sidebar (entre le badge de rôle et le bouton collapse) :
- Import `LogOut` depuis lucide-react
- Import `useNavigate` pour rediriger vers `/`
- Appel de `logout()` depuis `useRole()` + navigation vers `/`
- Style cohérent avec les autres boutons de la sidebar (icône + texte animé quand expanded)
- Couleur rouge/destructive pour bien le distinguer
