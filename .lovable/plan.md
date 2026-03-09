

## Plan : Internationaliser toutes les pages (persistance de la langue choisie)

### Probleme identifie
La langue est bien selectionnee sur la Landing page, mais toutes les pages internes (Dashboard, Documents, Formations, Evaluations, Roleplay, Analytics, Sidebar) utilisent des **chaines en dur en francais**. Le hook `t()` n'est utilise que sur Landing, Login et quelques elements de Documents.

### Solution

#### 1. Ajouter ~80 cles de traduction dans `LanguageContext.tsx`
Pour les 5 langues (fr, it, de, en, rm), ajouter les cles pour :
- **Sidebar** : nav_dashboard, nav_formations, nav_documents, nav_evaluations, nav_roleplay, nav_analytics, nav_users, nav_settings, nav_invite, role_guest
- **Dashboard** : dashboard_title, dashboard_subtitle, dashboard_subtitle_guest, stat_active_learners, stat_active_formations, stat_indexed_docs, stat_avg_score, formations_in_progress, recent_activity, quick_generate, quick_analytics, quick_roleplay, quick_invite, modules
- **Documents** : docs_title, docs_subtitle, docs_import, docs_search, docs_filter, docs_drop_zone, docs_drop_subtitle, docs_generate_training, docs_generate_desc, col_document, col_service, col_size, col_chunks, col_status, col_date, col_actions, status_indexed, status_pending
- **Formations** : formations_title, formations_subtitle, formations_generate, formations_readonly, formations_admin_only, status_active, status_draft, participants
- **Evaluations** : eval_title, eval_next, eval_finish, eval_restart, eval_success, eval_fail, eval_correct, eval_incorrect, eval_question
- **Roleplay** : roleplay_title, roleplay_subtitle, roleplay_placeholder
- **Analytics** : analytics_title, analytics_subtitle, analytics_completion_rate, analytics_avg_time, analytics_active_users, analytics_global_progress, analytics_service_perf, analytics_skills_map, analytics_skills_desc, analytics_completion, analytics_avg_score, analytics_active

#### 2. Mettre a jour chaque fichier pour utiliser `t()`

| Fichier | Nb de chaines a remplacer |
|---------|--------------------------|
| `AppSidebar.tsx` | ~10 (labels nav + invite + role) |
| `Index.tsx` | ~15 (titres, stats, actions) |
| `Documents.tsx` | ~15 (titres, colonnes, placeholders) |
| `Formations.tsx` | ~8 (titre, bouton, labels) |
| `Evaluations.tsx` | ~8 (titre, boutons, resultats) |
| `Roleplay.tsx` | ~4 (titre, sous-titre, placeholder) |
| `Analytics.tsx` | ~12 (titre, stats, labels) |

#### 3. Fichiers modifies
- `src/contexts/LanguageContext.tsx` — ajout des cles (x5 langues)
- `src/components/AppSidebar.tsx` — `useLanguage` + `t()`
- `src/pages/Index.tsx` — `useLanguage` + `t()`
- `src/pages/Documents.tsx` — remplacement des chaines
- `src/pages/Formations.tsx` — remplacement des chaines
- `src/pages/Evaluations.tsx` — `useLanguage` + `t()`
- `src/pages/Roleplay.tsx` — `useLanguage` + `t()`
- `src/pages/Analytics.tsx` — `useLanguage` + `t()`

### Remarque technique
Le `LanguageProvider` encapsule deja toute l'application, donc la langue choisie sur la Landing sera automatiquement propagee a toutes les pages apres login — aucun changement d'architecture necessaire.

