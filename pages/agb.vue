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
        <h1>Allgemeine Geschäftsbedingungen (AGB)</h1>
      </div>

      <div class="legal-content">
        <section>
          <h2>1. Geltungsbereich</h2>
          <p>
            Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung von ClevrSend,
            einem kostenlosen Dienst der MyTech Support GmbH zur Übertragung von Dateien
            mittels Peer-to-Peer Technologie.
          </p>
        </section>

        <section>
          <h2>2. Leistungsbeschreibung</h2>
          <p>
            ClevrSend ermöglicht die direkte Übertragung von Dateien zwischen Geräten mittels
            WebRTC-Technologie. Der Dienst umfasst:
          </p>
          <ul>
            <li>Lokale Netzwerk-Übertragung (LokalSend)</li>
            <li>Internet-Übertragung über verschiedene Netzwerke (InternetSend)</li>
            <li>QR-Code basierte Verbindungsherstellung</li>
          </ul>
          <p>
            <strong>Wichtig:</strong> ClevrSend ist ein kostenloser Dienst. Es besteht kein
            Anspruch auf Verfügbarkeit oder Funktionsfähigkeit.
          </p>
        </section>

        <section>
          <h2>3. Nutzungsbedingungen</h2>

          <h3>3.1 Erlaubte Nutzung</h3>
          <p>
            Die Nutzung von ClevrSend ist kostenlos und steht allen Nutzern zur Verfügung.
            Der Dienst darf ausschließlich für legale Zwecke genutzt werden.
          </p>

          <h3>3.2 Verbotene Nutzung</h3>
          <p>Folgende Nutzungsarten sind ausdrücklich untersagt:</p>
          <ul>
            <li>Übertragung illegaler, urheberrechtsverletzender oder jugendgefährdender Inhalte</li>
            <li>Nutzung für betrügerische oder missbräuchliche Zwecke</li>
            <li>Überlastung des Dienstes durch übermäßige Anfragen</li>
            <li>Reverse Engineering oder Manipulation des Dienstes</li>
          </ul>
        </section>

        <section>
          <h2>4. Datensicherheit und Haftung</h2>

          <h3>4.1 Keine Datenspeicherung</h3>
          <p>
            ClevrSend speichert keine übertragenen Dateien. Alle Übertragungen erfolgen
            direkt zwischen den Geräten (Peer-to-Peer). Der Betreiber hat zu keinem
            Zeitpunkt Zugriff auf die übertragenen Inhalte.
          </p>

          <h3>4.2 Haftungsausschluss</h3>
          <p>
            Der Betreiber übernimmt keine Haftung für:
          </p>
          <ul>
            <li>Datenverlust während der Übertragung</li>
            <li>Unterbrechungen oder Ausfälle des Dienstes</li>
            <li>Schäden durch fehlerhafte oder unvollständige Übertragungen</li>
            <li>Von Nutzern übertragene Inhalte</li>
            <li>Missbrauch des Dienstes durch Dritte</li>
          </ul>
          <p>
            Die Nutzung erfolgt auf eigenes Risiko. Der Nutzer ist selbst verantwortlich für:
          </p>
          <ul>
            <li>Die Sicherung seiner Daten vor der Übertragung</li>
            <li>Die Überprüfung der Integrität empfangener Dateien</li>
            <li>Die Einhaltung geltender Gesetze bei der Nutzung</li>
          </ul>

          <h3>4.3 Verfügbarkeit</h3>
          <p>
            Der Betreiber bemüht sich um eine hohe Verfügbarkeit des Dienstes, garantiert
            diese jedoch nicht. Wartungsarbeiten und technische Störungen können
            jederzeit zu Unterbrechungen führen.
          </p>
        </section>

        <section>
          <h2>5. Technische Voraussetzungen</h2>
          <p>
            Für die Nutzung von ClevrSend benötigen Sie:
          </p>
          <ul>
            <li>Einen modernen Webbrowser mit WebRTC-Unterstützung</li>
            <li>Eine stabile Internetverbindung</li>
            <li>JavaScript aktiviert</li>
          </ul>
          <p>
            Der Nutzer ist selbst verantwortlich für die Erfüllung dieser Voraussetzungen.
          </p>
        </section>

        <section>
          <h2>6. Änderungen der AGB</h2>
          <p>
            Der Betreiber behält sich vor, diese AGB jederzeit zu ändern. Änderungen werden
            auf dieser Seite veröffentlicht. Die weitere Nutzung des Dienstes nach einer
            Änderung gilt als Zustimmung zu den geänderten Bedingungen.
          </p>
        </section>

        <section>
          <h2>7. Beendigung der Nutzung</h2>
          <p>
            Der Nutzer kann die Nutzung von ClevrSend jederzeit ohne Angabe von Gründen
            beenden, indem er die Website schließt.
          </p>
          <p>
            Der Betreiber behält sich vor, Nutzern bei Verstoß gegen diese AGB den Zugang
            zum Dienst zu verwehren.
          </p>
        </section>

        <section>
          <h2>8. Geistiges Eigentum und Open Source</h2>

          <h3>8.1 Eigenentwicklung</h3>
          <p>
            Alle Rechte an ClevrSend, einschließlich Design, Marken und eigenen Code-Komponenten,
            liegen bei der MyTech Support GmbH. Eine Nutzung über den vorgesehenen Zweck hinaus
            bedarf der schriftlichen Genehmigung.
          </p>

          <h3>8.2 Open Source Komponenten</h3>
          <p>
            ClevrSend nutzt Open Source Software, insbesondere Teile von LocalSend
            (MIT-Lizenz). Die entsprechenden Lizenzbedingungen werden eingehalten:
          </p>
          <ul>
            <li><strong>LocalSend</strong> - MIT License - Copyright (c) 2022 Tien Do Nam</li>
            <li>Weitere verwendete Open Source Bibliotheken sind in der Dokumentation aufgeführt</li>
          </ul>
          <p>
            Die vollständigen Lizenztexte der verwendeten Open Source Komponenten sind auf
            Anfrage erhältlich.
          </p>
        </section>

        <section>
          <h2>9. Salvatorische Klausel</h2>
          <p>
            Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt
            die Wirksamkeit der übrigen Bestimmungen davon unberührt.
          </p>
        </section>

        <section>
          <h2>10. Anwendbares Recht und Gerichtsstand</h2>
          <p>
            Es gilt Schweizer Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist
            Saanen, Schweiz.
          </p>
        </section>

        <section>
          <h2>11. Kontakt</h2>
          <p>
            Bei Fragen zu diesen AGB wenden Sie sich bitte an:<br>
            info [at] my-tech [dot] ch
          </p>
        </section>

        <section>
          <p class="version-info">
            Stand: {{ new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long' }) }}<br>
            Version: 1.0
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DarkVeilBackground from "~/components/DarkVeilBackground.vue";

useHead({
  title: "AGB - ClevrSend",
  meta: [
    {
      name: "description",
      content: "Allgemeine Geschäftsbedingungen für die Nutzung von ClevrSend",
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

.version-info {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .legal-page {
    padding: 1rem;
  }

  .legal-container {
    padding: 2rem 1.5rem;
  }

  .legal-header h1 {
    font-size: 1.75rem;
  }

  .legal-content h2 {
    font-size: 1.5rem;
  }

  .legal-content h3 {
    font-size: 1.1rem;
  }
}
</style>
