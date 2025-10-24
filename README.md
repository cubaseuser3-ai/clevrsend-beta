# ClevrSend

Ein moderner, browserbasierter File-Sharing-Service basierend auf LocalSend. ClevrSend ermöglicht das sichere Teilen von Dateien zwischen Geräten im lokalen Netzwerk über WebRTC.

![ClevrSend](https://img.shields.io/badge/ClevrSend-File%20Sharing-blue)
![Nuxt.js](https://img.shields.io/badge/Nuxt.js-3.15-green)
![Vercel](https://img.shields.io/badge/Vercel-Ready-black)

## Features

- 🚀 **Schnelle Übertragung** - WebRTC für direkte Peer-to-Peer Verbindungen
- 🔒 **Sicher** - Optional PIN-geschützte Verbindungen
- 🌐 **Mehrsprachig** - Unterstützt Deutsch, Englisch, Koreanisch, Türkisch, Khmer
- 🎨 **Dark Mode** - Automatische Theme-Anpassung
- 📱 **Responsive** - Funktioniert auf allen Geräten
- ⚡ **Statisch** - Perfekt für Vercel, Netlify, GitHub Pages

## Schnellstart

## Setup

Make sure to install [pnpm](https://pnpm.io).

```bash
npm install -g pnpm
```

Get dependencies

```bash
pnpm install
```

Start the development server

```bash
pnpm run dev
```

## Deployment auf Vercel

### Methode 1: Via Vercel Dashboard (Empfohlen)

1. **Repository auf GitHub hochladen**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/IHR_USERNAME/clevrsend.git
   git push -u origin main
   ```

2. **Vercel Projekt erstellen**
   - Besuche [vercel.com/new](https://vercel.com/new)
   - Wähle dein GitHub Repository
   - Vercel erkennt automatisch Nuxt.js
   - Klicke auf **Deploy**

3. **Fertig!** Deine App ist jetzt live unter `https://clevrsend.vercel.app`

### Methode 2: Via Vercel CLI

```bash
# Vercel CLI installieren
npm i -g vercel

# Login
vercel login

# Deployen
vercel

# Production Deployment
vercel --prod
```

### Build-Einstellungen

| Setting | Value |
|---------|-------|
| Framework Preset | Nuxt.js |
| Build Command | `pnpm run generate` |
| Output Directory | `.output/public` |
| Install Command | `npm install -g pnpm && pnpm install` |

## Alternative Hosting

### Self-hosting (Docker)
1. Build: `docker build --tag clevrsend --file Containerfile`
2. Run: `docker run --rm --publish 8080:443 --volume caddy-data:/data clevrsend`

### Netlify / GitHub Pages
Output Directory: `.output/public` nach `pnpm run generate`

## Technologie-Stack

- **Frontend Framework:** [Nuxt.js 3](https://nuxt.com/) (Vue 3)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **File Transfer:** WebRTC + WebSockets
- **Compression:** [pako](https://github.com/nodeca/pako) (zlib)
- **i18n:** [@nuxtjs/i18n](https://i18n.nuxtjs.org/)

## Neue Sprache hinzufügen

1. Erstelle neue JSON-Datei in `i18n/locales/` (z.B. `fr.json`)
2. Füge die Sprache in `nuxt.config.ts` hinzu

## Lizenz

Basierend auf [LocalSend Web](https://github.com/localsend/web) - Apache License 2.0

---

Siehe auch: [README_DEPLOYMENT.md](README_DEPLOYMENT.md) für detaillierte Deployment-Anleitung
