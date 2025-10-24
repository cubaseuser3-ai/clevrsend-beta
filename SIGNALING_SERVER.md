# 🚀 ClevrSend Signaling Server

Eigener Signaling Server für ClevrSend mit Fallback zum offiziellen LocalSend Server.

## 📋 Features

- ✅ **100% kompatibel** mit LocalSend Protokoll
- ✅ **Fallback-System**: Eigener Server → LocalSend Server
- ✅ **Lightweight**: Nur ~200 Zeilen Code, keine Dependencies
- ✅ **Kostenlos**: Deno Deploy Free Tier
- ✅ **Automatische SSL**: HTTPS/WSS out-of-the-box
- ✅ **Health Check**: `/health` endpoint für Monitoring
- ✅ **Auto-Cleanup**: Inactive connections werden automatisch entfernt

---

## 🎯 Quick Start

### Option 1: Deno Deploy (Empfohlen - Kostenlos)

#### 1. Deno installieren
```bash
curl -fsSL https://deno.land/install.sh | sh
```

#### 2. Login zu Deno Deploy
```bash
deno login
```

#### 3. Server deployen
```bash
cd /Users/mytech/Downloads/MyTech\ Apps/Alternative/ClevrSend
deno deploy --project=clevrsend-signaling signaling-server.ts
```

#### 4. Custom Domain einrichten (Optional)
Gehe zu Deno Deploy Dashboard:
- Settings → Domains
- Füge hinzu: `signal.clevrsend.app`
- Erstelle CNAME Record bei deinem DNS Provider

---

### Option 2: Lokal testen

```bash
cd /Users/mytech/Downloads/MyTech\ Apps/Alternative/ClevrSend
deno run --allow-net signaling-server.ts
```

Server läuft auf: `ws://localhost:8080`

**Test:**
```bash
# Health Check
curl http://localhost:8080/health

# WebSocket Test (mit wscat)
npm install -g wscat
wscat -c ws://localhost:8080
```

---

### Option 3: Docker (Für eigenen Server)

#### Dockerfile erstellen:
```dockerfile
FROM denoland/deno:latest

WORKDIR /app
COPY signaling-server.ts .

EXPOSE 8080

CMD ["deno", "run", "--allow-net", "signaling-server.ts"]
```

#### Build & Run:
```bash
docker build -t clevrsend-signaling .
docker run -p 8080:8080 -d clevrsend-signaling
```

---

### Option 4: VPS (DigitalOcean, Hetzner, etc.)

#### 1. Server vorbereiten
```bash
# Deno installieren
curl -fsSL https://deno.land/install.sh | sh

# Nginx für SSL installieren
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx
```

#### 2. Signaling Server starten
```bash
# PM2 für Prozess-Management
curl -fsSL https://get.pnpm.io/install.sh | sh
pnpm add -g pm2

# Server starten
pm2 start "deno run --allow-net signaling-server.ts" --name clevrsend-signal
pm2 save
pm2 startup
```

#### 3. Nginx Reverse Proxy
```nginx
# /etc/nginx/sites-available/clevrsend-signal
server {
    listen 80;
    server_name signal.clevrsend.app;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/clevrsend-signal /etc/nginx/sites-enabled/
sudo certbot --nginx -d signal.clevrsend.app
sudo systemctl reload nginx
```

---

## 📊 Fallback-Logik

ClevrSend probiert Server in dieser Reihenfolge:

1. **Primary**: `wss://signal.clevrsend.app` (Dein Server)
   - Wenn verbunden: ✅ Nutze diesen
   - Wenn fehlgeschlagen: → Versuche Fallback

2. **Fallback**: `wss://public.localsend.org/v1/ws` (LocalSend Server)
   - Wenn verbunden: ✅ Nutze diesen
   - Wenn fehlgeschlagen: → Warte 5 Sekunden, zurück zu Primary

### Wie es funktioniert:

```typescript
const signalingServers = [
  "wss://signal.clevrsend.app",        // Dein Server
  "wss://public.localsend.org/v1/ws",  // Fallback
];

// Automatisches Failover
try {
  await connect(signalingServers[0]);  // Primary
} catch {
  await connect(signalingServers[1]);  // Fallback
}
```

---

## 🔍 Monitoring

### Health Check Endpoint

```bash
curl https://signal.clevrsend.app/health
```

**Response:**
```json
{
  "status": "ok",
  "clients": 5,
  "uptime": 123456.78
}
```

### Server Logs ansehen (Deno Deploy)

```bash
# Dashboard: https://dash.deno.com
# Projekt → Deployments → Logs
```

---

## ⚙️ Konfiguration

### Port ändern:
```typescript
// In signaling-server.ts Zeile 81
Deno.serve({ port: 8080 }, (req) => {
  // ...
});
```

### Timeout anpassen:
```typescript
// In signaling-server.ts Zeile 20
const timeout = 5 * 60 * 1000; // 5 Minuten
```

---

## 🐛 Troubleshooting

### Problem: "Connection failed to wss://signal.clevrsend.app"

**Lösung 1**: Server noch nicht deployed
```bash
# Checke ob Server läuft
curl https://signal.clevrsend.app/health
```

**Lösung 2**: DNS noch nicht propagiert
```bash
# Teste mit IP-Adresse
nslookup signal.clevrsend.app
```

**Lösung 3**: Fallback wird automatisch genutzt
```
✅ System nutzt automatisch LocalSend Server
Keine Aktion nötig!
```

---

### Problem: "Too many clients"

**Lösung**: Server skalieren (Deno Deploy macht das automatisch)

---

### Problem: "WebSocket upgrade failed"

**Lösung**: Check Nginx Config
```bash
# Stelle sicher dass Upgrade Headers gesetzt sind
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

---

## 📈 Performance

### Deno Deploy Limits (Free Tier):
- ✅ 100k Requests/Monat
- ✅ 100 GB Bandwidth
- ✅ Automatische Skalierung
- ✅ Globales Edge-Netzwerk

**Für ClevrSend ausreichend für:**
- ~1000 aktive Nutzer/Monat
- ~10000 Dateitransfers

---

## 🔐 Sicherheit

### Was der Server NICHT speichert:
- ❌ Keine Dateien
- ❌ Keine Dateiinhalte
- ❌ Keine Nachrichten
- ❌ Keine sensiblen Daten

### Was der Server speichert:
- ✅ Client IDs (temporär, nur während Verbindung)
- ✅ Geräte-Namen (temporär)
- ✅ Verbindungsstatus

### Verschlüsselung:
- ✅ WSS (WebSocket Secure)
- ✅ TLS 1.3
- ✅ Ende-zu-Ende zwischen Peers (WebRTC)

---

## 📝 Kosten

### Deno Deploy (Empfohlen)
- **Free Tier**: 0€/Monat
- **Pro**: 20$/Monat (mehr Resources)

### VPS
- **Hetzner CX11**: 3€/Monat
- **DigitalOcean Droplet**: 5$/Monat

### Cloudflare Workers
- **Free**: 0€/Monat (100k Requests/Tag)
- **Paid**: 5$/Monat (unlimited)

---

## 🎯 Next Steps

1. **Jetzt**: Server zu Deno Deploy deployen
2. **Später**: Monitoring einrichten (Optional)
3. **Optional**: Eigene Domain `signal.clevrsend.app`
4. **Advanced**: TURN Server für Internet-Modus

---

## 📚 Weitere Ressourcen

- [Deno Deploy Docs](https://deno.com/deploy/docs)
- [WebSocket Protocol](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [LocalSend Protocol](https://github.com/localsend/protocol)

---

## 🤝 Support

Bei Problemen:
1. Check Server Status: `curl https://signal.clevrsend.app/health`
2. Check Browser Console: DevTools → Console
3. Fallback wird automatisch genutzt ✅

---

**Version**: 1.0
**Last Updated**: 2025-10-19
