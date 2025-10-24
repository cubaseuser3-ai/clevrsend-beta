<template>
  <div class="legal-page">
    <DarkVeilBackground
      :hue-shift="0"
      :noise-intensity="0"
      :scanline-intensity="0"
      :speed="0.5"
      :scanline-frequency="0"
      :warp-amount="0"
      :resolution-scale="1"
    />

    <div class="legal-container">
      <div class="legal-header">
        <NuxtLink to="/" class="back-button">
          <Icon name="mdi:arrow-left" size="24" />
          <span>Zurück</span>
        </NuxtLink>
        <h1>Datenschutzerklärung</h1>
      </div>

      <div class="legal-content">
        <section>
          <h2>1. Datenschutz auf einen Blick</h2>

          <h3>Allgemeine Hinweise</h3>
          <p>
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
            personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene
            Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
          </p>

          <h3>Datenerfassung auf dieser Website</h3>
          <p>
            <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br>
            Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen
            Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
          </p>
        </section>

        <section>
          <h2>2. Hosting und Content Delivery Networks (CDN)</h2>

          <h3>Vercel</h3>
          <p>
            Wir hosten unsere Website bei Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
            Vercel kann beim Aufruf dieser Website automatisch verschiedene Daten erheben,
            darunter IP-Adressen, Browsertyp und -version sowie Zeitstempel.
          </p>
          <p>
            Die Nutzung von Vercel erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
            Wir haben ein berechtigtes Interesse an einer möglichst zuverlässigen Darstellung
            unserer Website.
          </p>
        </section>

        <section>
          <h2>3. Allgemeine Hinweise und Pflichtinformationen</h2>

          <h3>Datenschutz</h3>
          <p>
            Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst.
            Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der
            gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
          </p>

          <h3>Hinweis zur verantwortlichen Stelle</h3>
          <p>
            Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br><br>
            <strong>MyTech Support GmbH</strong><br>
            Dorfstrasse 105<br>
            3792 Saanen<br>
            Schweiz<br><br>
            E-Mail: info [at] my-tech [dot] ch
          </p>
        </section>

        <section>
          <h2>4. Datenerfassung auf dieser Website</h2>

          <h3>Server-Log-Dateien</h3>
          <p>
            Der Provider der Seiten erhebt und speichert automatisch Informationen in
            so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt:
          </p>
          <ul>
            <li>Browsertyp und Browserversion</li>
            <li>Verwendetes Betriebssystem</li>
            <li>Referrer URL</li>
            <li>Hostname des zugreifenden Rechners</li>
            <li>Uhrzeit der Serveranfrage</li>
            <li>IP-Adresse</li>
          </ul>
          <p>
            Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
            Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
          </p>

          <h3>WebRTC und Peer-to-Peer Verbindungen</h3>
          <p>
            ClevrSend nutzt WebRTC-Technologie für direkte Peer-to-Peer Verbindungen zwischen
            Ihrem Gerät und dem Empfänger-Gerät. Dabei werden folgende Daten verarbeitet:
          </p>
          <ul>
            <li>Ihre öffentliche IP-Adresse (notwendig für die Verbindungsherstellung)</li>
            <li>Gewählter Gerätename (wird nur während der aktiven Session gespeichert)</li>
            <li>Dateitransfer-Metadaten (Dateiname, -größe während der Übertragung)</li>
          </ul>
          <p>
            <strong>Wichtig:</strong> Alle Datenübertragungen erfolgen direkt zwischen den Geräten
            (Peer-to-Peer). Die übertragenen Dateien werden <strong>niemals</strong> auf unseren
            Servern gespeichert. Die Verbindung wird nach Abschluss der Übertragung automatisch
            getrennt.
          </p>

          <h3>Signaling-Server</h3>
          <p>
            Für die Herstellung der Peer-to-Peer Verbindung nutzen wir einen Signaling-Server
            (gehostet bei Render.com). Dieser Server speichert temporär:
          </p>
          <ul>
            <li>Session-IDs (werden nach max. 5 Minuten Inaktivität gelöscht)</li>
            <li>WebRTC-Verbindungsinformationen (nur während der Session)</li>
          </ul>
          <p>
            Diese Daten werden nicht dauerhaft gespeichert und dienen ausschließlich der
            Verbindungsherstellung.
          </p>
        </section>

        <section>
          <h2>5. Ihre Rechte</h2>
          <p>Sie haben jederzeit das Recht:</p>
          <ul>
            <li>Auskunft über Ihre bei uns gespeicherten Daten zu verlangen</li>
            <li>Berichtigung unrichtiger Daten zu verlangen</li>
            <li>Löschung Ihrer Daten zu verlangen</li>
            <li>Einschränkung der Datenverarbeitung zu verlangen</li>
            <li>Der Datenverarbeitung zu widersprechen</li>
            <li>Datenübertragbarkeit zu verlangen</li>
          </ul>
          <p>
            Für die Ausübung dieser Rechte wenden Sie sich bitte an:
            <a href="mailto:info@my-tech.ch">info@my-tech.ch</a>
          </p>
        </section>

        <section>
          <h2>6. Keine Cookies, kein Tracking</h2>
          <p>
            <strong>ClevrSend verwendet keine Cookies und kein Tracking.</strong> Wir setzen keine
            Analyse-Tools ein, die Ihr Nutzungsverhalten aufzeichnen. Ihre Privatsphäre ist uns wichtig.
          </p>
        </section>

        <section>
          <h2>7. Datenweitergabe an Dritte</h2>
          <p>
            Eine Übermittlung Ihrer persönlichen Daten an Dritte zu anderen als den im Folgenden
            aufgeführten Zwecken findet nicht statt:
          </p>
          <ul>
            <li>Vercel (Hosting-Provider) - nur technisch notwendige Daten</li>
            <li>Render.com (Signaling-Server) - nur temporäre Session-Daten</li>
          </ul>
        </section>

        <section>
          <h2>7a. Verwendung von Open Source Software</h2>
          <p>
            ClevrSend basiert teilweise auf Open Source Software, insbesondere:
          </p>
          <ul>
            <li><strong>LocalSend</strong> - MIT License - Copyright (c) 2022 Tien Do Nam</li>
            <li>Weitere Open Source Bibliotheken gemäß deren jeweiliger Lizenz</li>
          </ul>
          <p>
            Diese Open Source Komponenten werden gemäß ihren Lizenzbedingungen genutzt und
            verändern nicht die Datenverarbeitung oder Speicherung. Alle Datenschutzgrundsätze
            dieser Erklärung gelten unabhängig von den verwendeten Software-Komponenten.
          </p>
        </section>

        <section>
          <h2>8. Stand dieser Datenschutzerklärung</h2>
          <p>Stand: {{ new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long' }) }}</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DarkVeilBackground from "~/components/DarkVeilBackground.vue";

useHead({
  title: "Datenschutzerklärung - ClevrSend",
  meta: [
    {
      name: "description",
      content: "Datenschutzerklärung für ClevrSend - Informationen zur Datenverarbeitung",
    },
  ],
});
</script>

<style scoped>
.legal-page {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.legal-container {
  max-width: 800px;
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  padding: 3rem;
  position: relative;
  z-index: 10;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  margin: 2rem auto;
}

.legal-header {
  margin-bottom: 2rem;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  transition: color 0.2s;
}

.back-button:hover {
  color: rgba(255, 255, 255, 1);
}

.legal-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.legal-content {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.8;
}

.legal-content section {
  margin-bottom: 2.5rem;
}

.legal-content h2 {
  font-size: 1.75rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
  margin-top: 0;
}

.legal-content h3 {
  font-size: 1.25rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.legal-content p {
  margin: 0 0 1rem 0;
}

.legal-content ul {
  margin: 0.5rem 0 1rem 1.5rem;
  padding: 0;
}

.legal-content li {
  margin-bottom: 0.5rem;
}

.legal-content a {
  color: rgb(249, 115, 22);
  text-decoration: none;
  transition: color 0.2s;
}

.legal-content a:hover {
  color: rgb(251, 146, 60);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .legal-page {
    padding: 1rem;
  }

  .legal-container {
    padding: 2rem 1.5rem;
  }

  .legal-header h1 {
    font-size: 2rem;
  }

  .legal-content h2 {
    font-size: 1.5rem;
  }

  .legal-content h3 {
    font-size: 1.1rem;
  }
}
</style>
