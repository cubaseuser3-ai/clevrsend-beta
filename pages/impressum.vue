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
        <h1>Impressum</h1>
      </div>

      <div class="legal-content">
        <section>
          <h2>Angaben gemäß § 5 TMG</h2>
          <p>
            <strong>MyTech Support GmbH</strong><br>
            Dorfstrasse 105<br>
            3792 Saanen<br>
            Schweiz
          </p>
        </section>

        <section>
          <h2>Kontakt</h2>
          <p>
            E-Mail: info [at] my-tech [dot] ch
          </p>
        </section>

        <section>
          <h2>Haftungsausschluss</h2>

          <h3>Haftung für Inhalte</h3>
          <p>
            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
            Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich.
          </p>

          <h3>Haftung für Links</h3>
          <p>
            Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir
            keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr
            übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
            oder Betreiber der Seiten verantwortlich.
          </p>

          <h3>Urheberrecht</h3>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
            unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung
            und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
            schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
        </section>

        <section>
          <h2>Datenschutz</h2>
          <p>
            Informationen zum Datenschutz finden Sie in unserer
            <NuxtLink to="/datenschutz" class="text-link">Datenschutzerklärung</NuxtLink>.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DarkVeilBackground from "~/components/DarkVeilBackground.vue";

useHead({
  title: "Impressum - ClevrSend",
  meta: [
    {
      name: "description",
      content: "Impressum und rechtliche Angaben von ClevrSend by MyTech Support GmbH",
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

.legal-content a {
  color: rgb(249, 115, 22);
  text-decoration: none;
  transition: color 0.2s;
}

.legal-content a:hover {
  color: rgb(251, 146, 60);
  text-decoration: underline;
}

.text-link {
  color: rgb(249, 115, 22);
  font-weight: 500;
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
