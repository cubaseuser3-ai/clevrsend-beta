# ClevrSend - Deployment Guide

ClevrSend ist ein Klon von LocalSend Web zum einfachen Teilen von Dateien zwischen Geräten im lokalen Netzwerk.

## Vercel Deployment

### Voraussetzungen
- Ein GitHub/GitLab/Bitbucket Account
- Ein Vercel Account (kostenlos unter [vercel.com](https://vercel.com))

### Schritt 1: Repository zu Git hinzufügen

```bash
cd ClevrSend
git init
git add .
git commit -m "Initial ClevrSend setup"
```

### Schritt 2: Repository zu GitHub pushen

1. Erstelle ein neues Repository auf GitHub
2. Führe folgende Befehle aus:

```bash
git remote add origin https://github.com/IHR_USERNAME/clevrsend.git
git branch -M main
git push -u origin main
```

### Schritt 3: Mit Vercel verbinden

#### Option A: Über Vercel Dashboard (Empfohlen)
1. Gehe zu [vercel.com/new](https://vercel.com/new)
2. Importiere dein GitHub Repository
3. Vercel erkennt automatisch Nuxt.js
4. Klicke auf "Deploy"

#### Option B: Über Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```

### Build-Einstellungen (werden automatisch erkannt)
- **Framework Preset:** Nuxt.js
- **Build Command:** `pnpm run generate`
- **Output Directory:** `.output/public`
- **Install Command:** `npm install -g pnpm && pnpm install`

### Umgebungsvariablen (Optional)
Keine Umgebungsvariablen erforderlich für die Grundfunktionalität.

### Custom Domain (Optional)
1. Gehe zu deinem Projekt auf Vercel
2. Settings → Domains
3. Füge deine Custom Domain hinzu

## Lokale Entwicklung

```bash
# Development Server starten
pnpm run dev

# Build für Production
pnpm run generate

# Preview Production Build
pnpm run preview
```

## Features

- ✅ Dateiübertragung über WebRTC
- ✅ Mehrsprachig (Deutsch, Englisch, Koreanisch, Türkisch, Khmer)
- ✅ Dark Mode Support
- ✅ PIN-geschützte Verbindungen
- ✅ Statisches Hosting (perfekt für Vercel)

## Technologie Stack

- **Framework:** Nuxt.js 3
- **UI:** Vue 3 + Tailwind CSS
- **Internationalisierung:** @nuxtjs/i18n
- **File Transfer:** WebRTC + WebSockets
- **Compression:** pako (gzip)

## Support

Bei Fragen oder Problemen, siehe die Original-Dokumentation:
- [LocalSend GitHub](https://github.com/localsend/web)
- [Nuxt.js Docs](https://nuxt.com)
- [Vercel Docs](https://vercel.com/docs)

## Lizenz

Basierend auf LocalSend Web (Apache License 2.0)
