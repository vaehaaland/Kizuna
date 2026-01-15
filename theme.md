---

title: Kizuna Product & Theme Spec
app_name: Kizuna
version: 1.0
updated: 2026-01-15
timezone: Europe/Oslo
owner: Aleks
status: Draft
-------------

# Kizuna — Product & Theme Spec (v1.0)

Kizuna betyr «bond / connection». Appen skal føles som ein pålitelig *nakama* for å få ting gjort: rolig når du planlegger, og knallhard fokus når du jobber.

---

## 1. Vision

**Kjerneidé:**
Kizuna er ein multi-page ToDo-app med anime-inspirert premium UI, bygget *local-first* med IndexedDB frå dag 1, og med ein StorageAdapter som gjer cloud sync lett å legge til seinare.

**Mål:**

* Rask capture av tasks (Inbox-first)
* Struktur: projects + tags + filters
* Høg brukbarhet: keyboard-first, snappy UI
* Offline-first: alltid tilgjengelig
* Klar migreringsvei til cloud storage + auth

---

## 2. Stack (v1.0)

**Frontend / App**

* Nuxt 3 (Vue 3 + TypeScript)
* TailwindCSS (med CSS-variablar for themes)
* Pinia (state management)
* Dexie (IndexedDB wrapper)
* Icons: lucide-vue
* Validation: Zod

**Hosting**

* v1.0: Vercel eller Netlify
* vNext: Supabase (auth + storage) eller .NET Minimal API + Postgres

---

## 3. Architecture — StorageAdapter

### Prinsipp

Appen koder mot eit interface (adapter), ikkje direkte mot IndexedDB.
Dette gjer at lokal lagring kan bytast med cloud sync utan rewrite.

### StorageAdapter (konsept)

* getAll()
* getById(id)
* upsert(entity)
* delete(id) (soft delete anbefalt)
* export() / import()
* subscribe(cb) (valgfritt)

### Implementasjonar

* v1.0: IndexedDbAdapter (Dexie)
* vNext: CloudAdapter (Supabase / API)
* Sync v1: last write wins

---

## 4. Data Model (v1.0)

### Task

* id (uuid)
* title (string)
* description? (string)
* done (boolean)
* priority (0–3)
* dueAt? (ISO datetime)
* projectId? (uuid)
* tags (string[])
* createdAt (ISO datetime)
* updatedAt (ISO datetime)
* deletedAt? (ISO datetime)

### Project

* id (uuid)
* name (string)
* color? (string)
* icon? (string)
* createdAt (ISO datetime)
* updatedAt (ISO datetime)

---

## 5. Pages (v1.0)

Minimum multi-page struktur:

* /inbox — default capture view
* /today — tasks som er due i dag
* /projects — prosjektliste + prosjekt-view
* /settings — theme, import/export, preferences

Optional (vNext):

* /upcoming
* /stats

---

## 6. v1.0 Scope (Definition of Done)

Når dette er ferdig, har du ein solid plattform for vidare feature-bygging.

### Core features

* Task CRUD
* Done / Undone
* Prioritet P0–P3
* Due date
* Tags
* Projects (grunnleggjande)
* Search + filter
* Keyboard shortcuts (add, toggle done, navigasjon)

### Persistence

* IndexedDB via Dexie
* DB-migrering (minst 1 versjon)
* Import / Export JSON

### UI / UX

* TaskCard-komponent (theme-aware)
* Empty states
* Responsivt layout
* Basic accessibility (focus states, aria-labels)

### Release readiness

* Smoke test (manuell eller lett e2e)
* Deploy pipeline
* GitHub release v1.0

---

## 7. Initial Steps — Road to v1.0

1. Bootstrap Nuxt 3 + TS + Tailwind
2. Setup Pinia + Dexie
3. Layout + navigation
4. Pages: Inbox, Today, Projects, Settings
5. Data models + StorageAdapter
6. Task CRUD + filters
7. Theme system + persistence
8. Import / Export
9. Deploy + tag v1.0

---

## 8. Theme System

Kizuna har to hovudtema:

* Light mode: calm, fin++, slice-of-life
* Dark mode: head-down, fokus, mission mode

Switching:
```html
* <html data-theme="kizuna-light">
* <html data-theme="kizuna-dark">
```
---

## 9. Theme — Kizuna Hanami (Light)

**Vibe:** calm, warm, anime slice-of-life
**Keywords:** paper, sky, sakura, friendly focus

### CSS Variables
```css
:root {
--bg-app: #f6f4ef;
--bg-surface: #ffffff;
--bg-card: #ffffff;

--text-primary: #0f172a;
--text-secondary: #475569;
--text-muted: #64748b;

--primary: #0ea5e9;
--primary-hover: #0284c7;
--accent: #fb7185;

--danger: #ef4444;
--success: #22c55e;
--warning: #eab308;

--radius-sm: 0.375rem;
--radius-md: 12px;
--radius-lg: 20px;

--shadow-sm: 0 1px 2px rgba(0,0,0,0.06);
--shadow-md: 0 10px 20px rgba(0,0,0,0.10);
--shadow-lg: 0 18px 35px rgba(0,0,0,0.12);

color-scheme: light;
}
```

### Light UI Rules

* Varm bakgrunn → cards føles som papir
* Bruk ring i staden for harde borders
* Accent brukt sparsomt (active, selected, badges)

---

## 10. Theme — Kizuna Ronin (Dark)

**Vibe:** disciplined, high-contrast, get shit done
**Keywords:** night, amber focus, quest log

### CSS Variables
```css
:root {
--bg-app: #05070f;
--bg-surface: #0b1220;
--bg-card: #111a2e;

--text-primary: #f8fafc;
--text-secondary: #cbd5e1;
--text-muted: #94a3b8;

--primary: #fbbf24;
--primary-hover: #f59e0b;
--accent: #22d3ee;

--danger: #ef4444;
--success: #22c55e;
--warning: #facc15;

--radius-sm: 0.375rem;
--radius-md: 12px;
--radius-lg: 20px;

--shadow-sm: 0 2px 10px rgba(0,0,0,0.30);
--shadow-md: 0 18px 40px rgba(0,0,0,0.45);
--shadow-lg: 0 26px 70px rgba(0,0,0,0.60);

color-scheme: dark;
}
```

### Dark UI Rules

* Kontrast = fokus
* Amber = primary action
* Cyan = anime HUD detail

---

## 11. Shared Kizuna Identity

### Signature Detail

Bond-thread highlight:
--accent markerer active project, filters og keyboard focus.

### Typography

* Base: Inter
* Optional headings: Zen Kaku Gothic New / Noto Sans JP

### Layout

* Card padding: p-4
* List spacing: gap-3
* Container width: max-w-3xl

---

## 12. Tailwind + CSS Vars Pattern

Example:
```html
<div class="min-h-dvh bg-[var(--bg-app)] text-[var(--text-primary)]">
  <main class="mx-auto max-w-3xl p-4">
    <article class="bg-[var(--bg-card)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]">
      ...
    </article>
  </main>
</div>
```
---

## 13. Sanity Checklist

* [ ] Light mode: varm, rolig, lesbar
* [ ] Dark mode: kontrast, fokus, mission vibe
* [ ] Theme persists mellom reloads
* [ ] TaskCard lesbar på 1 sekund
* [ ] Keyboard focus synleg
* [ ] Import / Export fungerer
