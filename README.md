# Tischtennis Turnier App

Eine moderne, Cloud-native Webapplikation zur Verwaltung von Universitätsturnieren, sofort deploybar auf **Vercel**.

## Features
- 🚀 **Next.js 14 App Router** für schnelle Klick-Interaktionen
- 📊 **Vercel Postgres** Backend: Asynchrone und serverlose Persistenz
- 🏆 **Turnier-Engine**: Automatische Gruppengenerierung per Skill-Level-Ausgleich und KO-Baum-Engine
- 📺 **Scoreboard**: Beamer-optimiertes Live-Dashboard
- 🎨 **Sportliches Design**: Responsive Mobile-First mit automatischem Darkmode durch Vanilla CSS und CSS-Variables

## Vercel Deployment (Empfohlen)

Die App ist perfekt vorbereitet für Vercel.

1. **GitHub-Repository verknüpfen**: Lade den Code auf ein Remote-Repo (z.B. GitHub).
2. **Vercel Project anlegen**: Importiere das Repository via `vercel.com/new`.
3. **Datenbank verbinden**:
   - Gehe in deinem Vercel Projekt auf **Storage**
   - Klicke auf **Create database** -> **Postgres**
   - Verbinde die Datenbank mit deinem Projekt (Vercel fügt die Environment-Variablen automatisch hinzu).
4. **Deployen**: Klicke auf Deploy. Fertig!
   - Auf der Live-Seite: Klicke oben auf "Turnier-Admin" und generiere 16 Demo-Spieler, um die Datenbanktabellen zu initialisieren.

## Lokale Entwicklung (Local Dev)
Zur lokalen Entwicklung mit echter Datenbankanbindung:

1. Installiere die [Vercel CLI](https://vercel.com/docs/cli).
2. Logge dich ein: `vercel login`
3. Verbinde dein lokales Verzeichnis mit deinem Vercel Projekt (wo die Datenbank läuft): `vercel link`
4. Lade die Datenbank-Environment-Variablen in eine `.env.local`: `vercel env pull .env.local`
5. Starte die App: `npm run dev`

Die Tabellenstruktur der Datenbank initialisiert sich beim ersten Verwenden bestimmter Features von selbst (Fallback Init), alternativ über eine Code-Ausführung oder API Setup Call.

## Tech-Stack
- **Frontend**: React, Next.js Server Components, Vanilla CSS für schnelles Laden, Lucide React für Icons.
- **Backend**: Next.js Server Actions.
- **Datenbank**: `@vercel/postgres` (PostgreSQL via Vercel Edge).
