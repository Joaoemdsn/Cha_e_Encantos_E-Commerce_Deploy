<template>
  <main class="contact-page">
    <section class="contact-container">
      <div class="contact-hero">
        <p class="eyebrow">Fale conosco</p>

        <h1>Vamos conversar sobre chás, encantos e boas experiências?</h1>

        <p>
          Estamos sempre por perto para ajudar você a escolher o blend ideal,
          tirar dúvidas sobre pedidos, oficinas, assinaturas mensais ou montar
          um kit especial cheio de afeto.
        </p>
      </div>

      <section class="contact-cards" aria-label="Principais canais de contato">
        <a
          class="contact-card"
          href="https://wa.me/558695063535"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="contact-icon">
            <span>W</span>
          </div>

          <div>
            <h2>WhatsApp</h2>
            <p>Fale diretamente com nossa equipe para pedidos, dúvidas e sugestões.</p>
            <strong>(86) 99984-2026</strong>
          </div>
        </a>

        <a
          class="contact-card"
          href="https://www.instagram.com/chaeencantos"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="contact-icon">
            <span>I</span>
          </div>

          <div>
            <h2>Instagram</h2>
            <p>Acompanhe novidades, bastidores, blends especiais e dicas de preparo.</p>
            <strong>@chaeencantos</strong>
          </div>
        </a>

        <a
          class="contact-card"
          href="https://www.tiktok.com/@chaeencantos"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="contact-icon">
            <span>T</span>
          </div>

          <div>
            <h2>TikTok</h2>
            <p>Veja conteúdos rápidos sobre chás, rituais, aromas e combinações.</p>
            <strong>@chaeencantos</strong>
          </div>
        </a>
      </section>

      <section class="contact-info-section">
        <div class="contact-info-card">
          <p class="eyebrow">Atendimento</p>

          <h2>Horários de acolhimento</h2>

          <ul>
            <li>
              <span>Segunda a sexta</span>
              <strong>08h às 18h</strong>
            </li>

            <li>
              <span>Sábado</span>
              <strong>09h às 14h</strong>
            </li>

            <li>
              <span>Domingo</span>
              <strong>Fechado</strong>
            </li>
          </ul>
        </div>

        <div class="contact-info-card">
          <p class="eyebrow">Nosso espaço</p>

          <h2>Venha sentir de perto</h2>

          <p>
            Rua das Ervas, 124<br />
            Centro, Teresina - PI<br />
            CEP: 64000-120
          </p>

          <p>
            Para oficinas, experiências sensoriais e atendimentos especiais,
            recomendamos falar conosco antes pelo WhatsApp.
          </p>
        </div>
      </section>

      <section class="contact-message">
        <div>
          <p class="eyebrow">Com carinho</p>
          <h2>Seu momento de pausa começa com uma mensagem.</h2>
        </div>

        <p>
          Seja para escolher um chá relaxante, presentear alguém especial ou
          conhecer nossas caixinhas mensais, teremos alegria em te atender.
        </p>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
// Página institucional estática
</script>

<style scoped>
.contact-page {
  width: 100%;
  background: #f8f5ee;
  color: #102820;
  padding: 72px 24px 96px;
}

.contact-container {
  max-width: 1180px;
  margin: 0 auto;
}

.contact-hero {
  max-width: 860px;
  margin-bottom: 48px;
}

.eyebrow {
  color: #d8a05d;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0 0 14px;
}

.contact-hero h1,
.contact-info-card h2,
.contact-message h2 {
  font-family: Georgia, "Times New Roman", serif;
  color: #102820;
  line-height: 1.08;
  margin: 0;
}

.contact-hero h1 {
  font-size: clamp(2.6rem, 6vw, 5rem);
}

.contact-hero p {
  color: #51665b;
  font-size: 1.1rem;
  line-height: 1.8;
  max-width: 740px;
  margin: 26px 0 0;
}

.contact-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
  margin-bottom: 56px;
}

.contact-card {
  background: #fff8e8;
  border: 1px solid rgba(16, 40, 32, 0.08);
  border-radius: 32px;
  padding: 30px;
  min-height: 300px;
  color: inherit;
  text-decoration: none;
  box-shadow: 0 16px 38px rgba(16, 40, 32, 0.07);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 28px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.contact-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 22px 48px rgba(16, 40, 32, 0.12);
}

.contact-icon {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: #102820;
  color: #fff8e8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-icon span {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.65rem;
  font-weight: 800;
}

.contact-card h2 {
  font-family: Georgia, "Times New Roman", serif;
  color: #102820;
  font-size: 1.7rem;
  margin: 0 0 12px;
}

.contact-card p {
  color: #51665b;
  line-height: 1.7;
  margin: 0 0 18px;
}

.contact-card strong {
  color: #8a5a24;
  font-size: 1rem;
}

.contact-info-section {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 24px;
  margin-bottom: 56px;
}

.contact-info-card {
  background: #102820;
  color: #fff8e8;
  border-radius: 32px;
  padding: 36px;
  box-shadow: 0 18px 45px rgba(16, 40, 32, 0.13);
}

.contact-info-card h2 {
  color: #fff8e8;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  margin-bottom: 24px;
}

.contact-info-card p {
  color: rgba(255, 248, 232, 0.78);
  line-height: 1.8;
  margin: 0 0 18px;
}

.contact-info-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.contact-info-card li {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 248, 232, 0.14);
}

.contact-info-card li:last-child {
  border-bottom: none;
}

.contact-info-card li span {
  color: rgba(255, 248, 232, 0.76);
}

.contact-info-card li strong {
  color: #d8a05d;
}

.contact-message {
  background:
    radial-gradient(circle at top left, rgba(216, 160, 93, 0.25), transparent 32%),
    #fff8e8;
  border: 1px solid rgba(16, 40, 32, 0.08);
  border-radius: 36px;
  padding: 42px;
  display: grid;
  grid-template-columns: 1fr 0.9fr;
  gap: 32px;
  align-items: center;
  box-shadow: 0 16px 38px rgba(16, 40, 32, 0.07);
}

.contact-message h2 {
  font-size: clamp(2rem, 4vw, 3.2rem);
}

.contact-message p {
  color: #51665b;
  font-size: 1.05rem;
  line-height: 1.8;
  margin: 0;
}

@media (max-width: 980px) {
  .contact-cards,
  .contact-info-section,
  .contact-message {
    grid-template-columns: 1fr;
  }

  .contact-card {
    min-height: auto;
  }
}

@media (max-width: 640px) {
  .contact-page {
    padding: 48px 18px 72px;
  }

  .contact-card,
  .contact-info-card,
  .contact-message {
    border-radius: 26px;
    padding: 26px;
  }

  .contact-info-card li {
    flex-direction: column;
    gap: 6px;
  }
}
</style>