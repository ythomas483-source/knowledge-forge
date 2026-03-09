

## Plan : Agrandir le logo + Ajouter le Romanche

### 1. Agrandir le logo (Landing.tsx)
- Passer le texte "Lumina Swiss" de `text-lg` à `text-2xl`
- Passer le sous-titre de `text-[10px]` à `text-xs`

### 2. Ajouter le Romanche (rm)
- **`src/contexts/LanguageContext.tsx`** : Ajouter `"rm"` au type `Locale` et ajouter toutes les traductions en romanche dans l'objet `translations`
- **`src/pages/Landing.tsx`** : Ajouter `{ code: "rm", label: "RM" }` dans le tableau `locales`
- **Footer** : Ajouter `RM` dans la liste `FR · IT · DE · EN · RM`

### 3. Traductions romanches
Toutes les clés seront traduites en romanche (rumantsch grischun), par exemple :
- `hero_subtitle` → "Transfurmai vossa documentaziun interna en furmaziuns intelligentas"
- `login_submit` → "S'annunziar"
- `footer` → "Creà en Svizra"

