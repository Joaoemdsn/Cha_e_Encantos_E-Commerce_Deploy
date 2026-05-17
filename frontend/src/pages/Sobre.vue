<template>

<main class="about-page">
    <section class="about-container">
    <div class="about-hero">
      <div class="about-hero-copy">
        <p class="eyebrow">Nossa História</p>

        <h1>Um refúgio para quem acredita no poder das plantas.</h1>

        <p class="hero-text">
          A Chá & Encantos nasceu do encontro entre afeto, natureza e memória.
          Mais do que vender chás, criamos experiências para desacelerar,
          acolher e reconectar cada pessoa com o cuidado simples de preparar
          uma infusão.
        </p>
      </div>

      <div class="about-hero-card">
        <span>Por Aurora</span>
        <p>
          “Cada erva, cada aroma, cada xícara tem algo a dizer. Nossa missão é
          ajudar você a escutar.”
        </p>
      </div>
    </div>

    <div class="story-section">
      <div class="story-image-card">
        <div class="image-placeholder">
          <span>Chá & Encantos</span>
        </div>
      </div>

      <div class="story-copy">
        <p class="eyebrow">Como tudo começou</p>

        <h2>Uma jornada entre plantas, saberes antigos e pequenos encantos.</h2>

        <p>
          Olá! Meu nome é Aurora, e eu sou apaixonada por chás. Durante anos,
          estudei plantas medicinais, viajei pelo interior do Brasil e aprendi
          com pessoas que carregam saberes profundos sobre a natureza.
        </p>

        <p>
          Em muitas dessas viagens, conheci receitas passadas de geração em
          geração: infusões preparadas por avós para acalmar noites inquietas,
          ervas usadas por comunidades tradicionais para trazer equilíbrio e
          misturas aromáticas que transformavam simples encontros em rituais de
          cuidado.
        </p>

        <p>
          Foi assim que nasceu a Chá & Encantos: primeiro como um pequeno espaço
          de partilha, depois como uma loja criada para aproximar pessoas das
          plantas. Desde o início, nosso desejo nunca foi apenas vender chá, mas
          oferecer pausas possíveis em meio à pressa do dia a dia.
        </p>
      </div>
    </div>

    <div class="quote-section">
      <p>
        “Não é apenas uma loja de chás — é um lugar onde cada infusão carrega
        uma história.”
      </p>
    </div>

    <div class="about-layout">
      <div class="about-copy">
        <p class="eyebrow">O que torna cada infusão especial</p>

        <h2>Tradição, cuidado e sensibilidade em cada detalhe.</h2>

        <p>
          Algumas das nossas inspirações vêm de tradições indígenas, outras das
          curas da vovó, outras de culturas distantes que encontrei em minhas
          andanças. Cada erva é escolhida com intenção: flores para suavidade,
          raízes para profundidade, especiarias para presença e folhas para
          frescor.
        </p>

        <p>
          Trabalhamos com pequenos lotes, blends autorais e ingredientes
          selecionados para preservar aroma, frescor e equilíbrio. Queremos que
          cada produto tenha personalidade, mas também aconchego.
        </p>

        <p>
          Além da venda de chás, oferecemos oficinas de preparo, atendimentos
          com terapeutas naturais, kits personalizados e assinaturas mensais com
          experiências sensoriais. Tudo é pensado com cuidado, afeto e conexão
          com a terra.
        </p>
      </div>

      <div class="values-grid" aria-label="Valores da marca">
        <article>
          <span>01</span>
          <h3>Ingredientes com história</h3>
          <p>
            Buscamos ervas, flores e especiarias com origem cuidadosa,
            respeitando seus usos tradicionais e suas características naturais.
          </p>
        </article>

        <article>
          <span>02</span>
          <h3>Blends autorais</h3>
          <p>
            Cada mistura é testada por aroma, equilíbrio, intensidade e sensação,
            para transformar o preparo em uma experiência completa.
          </p>
        </article>

        <article>
          <span>03</span>
          <h3>Cuidado no envio</h3>
          <p>
            Pensamos nas embalagens para preservar frescor, beleza e delicadeza,
            como se cada pedido fosse um presente.
          </p>
        </article>

        <article>
          <span>04</span>
          <h3>Experiências sensoriais</h3>
          <p>
            Criamos oficinas, kits e caixinhas mensais para quem deseja conhecer
            novos aromas, rituais e formas de preparo.
          </p>
        </article>
      </div>
    </div>

    <div class="experience-section">
      <div>
        <p class="eyebrow">Além da xícara</p>
        <h2>Um espaço para aprender, sentir e compartilhar.</h2>
      </div>

      <div class="experience-grid">
        <article>
          <h3>Oficinas de preparo</h3>
          <p>
            Encontros para aprender temperaturas, tempos de infusão, combinações
            de ervas e pequenos rituais para tornar o chá mais especial.
          </p>
        </article>

        <article>
          <h3>Kits personalizados</h3>
          <p>
            Seleções feitas de acordo com momentos, gostos e intenções: relaxar,
            presentear, energizar ou simplesmente experimentar algo novo.
          </p>
        </article>

        <article>
          <h3>Assinatura mensal</h3>
          <p>
            Uma caixinha pensada para surpreender todos os meses, com produtos,
            aromas e experiências escolhidas com carinho.
          </p>
        </article>
      </div>
    </div>

    <div class="closing-section">
      <p class="eyebrow">Nossa essência</p>

      <h2>Chá é pausa. Chá é memória. Chá é cuidado.</h2>

      <p>
        Na Chá & Encantos, acreditamos que pequenos gestos podem transformar o
        dia. Uma água aquecida com calma, uma erva escolhida com intenção, uma
        xícara entre as mãos. É nesse instante simples que mora o nosso encanto.
      </p>
    </div>
  </section>
  </main>
</template>

<script setup lang="ts">
// Página institucional estática
</script>

<style scoped>
.about-page {
  width: 100%;
  background: #f8f5ee;
  color: #102820;
  padding: 56px 24px 96px;
}

.about-container {
  width: min(100%, 1180px);
  margin: 0 auto;
}

.about-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);
  gap: 40px;
  align-items: stretch;
  margin-bottom: 72px;
}

.about-hero-copy {
  background:
    radial-gradient(circle at top left, rgba(216, 160, 93, 0.2), transparent 34%),
    #fff8e8;
  border-radius: 36px;
  padding: 56px;
  box-shadow: 0 18px 45px rgba(16, 40, 32, 0.08);
}

.eyebrow {
  color: #d8a05d;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.78rem;
  margin: 0 0 14px;
}

.about-hero h1,
.story-copy h2,
.about-copy h2,
.experience-section h2,
.closing-section h2 {
  font-family: Georgia, "Times New Roman", serif;
  color: #102820;
  line-height: 1.08;
  margin: 0;
}

.about-hero h1 {
  font-size: clamp(2.6rem, 6vw, 5.4rem);
  max-width: 920px;
}

.hero-text {
  color: #51665b;
  font-size: 1.12rem;
  line-height: 1.8;
  max-width: 760px;
  margin: 28px 0 0;
}

.about-hero-card {
  border-radius: 36px;
  background: #102820;
  color: #fff8e8;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 360px;
  box-shadow: 0 18px 45px rgba(16, 40, 32, 0.16);
  position: relative;
  overflow: hidden;
}

.about-hero-card::before {
  content: "";
  position: absolute;
  width: 220px;
  height: 220px;
  border: 1px solid rgba(216, 160, 93, 0.45);
  border-radius: 50%;
  top: -72px;
  right: -72px;
}

.about-hero-card span {
  color: #d8a05d;
  font-weight: 800;
  margin-bottom: 16px;
  position: relative;
}

.about-hero-card p {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.55rem;
  line-height: 1.45;
  margin: 0;
  position: relative;
}

.story-section {
  display: grid;
  grid-template-columns: minmax(280px, 0.8fr) minmax(0, 1.2fr);
  gap: 48px;
  align-items: center;
  margin-bottom: 72px;
}

.story-image-card {
  border-radius: 36px;
  overflow: hidden;
  min-height: 520px;
  background: #f5efe4;
  box-shadow: 0 18px 45px rgba(16, 40, 32, 0.1);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  min-height: 520px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 36px;
  background:
    linear-gradient(rgba(16, 40, 32, 0.08), rgba(16, 40, 32, 0.4)),
    radial-gradient(circle at 30% 20%, rgba(216, 160, 93, 0.48), transparent 28%),
    radial-gradient(circle at 70% 55%, rgba(16, 40, 32, 0.32), transparent 32%),
    #d8c7a8;
}

.image-placeholder span {
  font-family: Georgia, "Times New Roman", serif;
  color: #fff8e8;
  font-size: 2rem;
  font-weight: 700;
}

.story-copy h2,
.about-copy h2,
.experience-section h2,
.closing-section h2 {
  font-size: clamp(2rem, 4vw, 3.4rem);
  margin-bottom: 24px;
}

.story-copy p,
.about-copy p,
.experience-grid p,
.closing-section p {
  color: #51665b;
  line-height: 1.85;
  font-size: 1.02rem;
}

.story-copy p:not(.eyebrow),
.about-copy p:not(.eyebrow) {
  margin: 0 0 18px;
}

.quote-section {
  margin: 0 auto 72px;
  max-width: 920px;
  text-align: center;
  padding: 46px 36px;
  border-top: 1px solid rgba(16, 40, 32, 0.12);
  border-bottom: 1px solid rgba(16, 40, 32, 0.12);
}

.quote-section p {
  font-family: Georgia, "Times New Roman", serif;
  color: #102820;
  font-size: clamp(1.7rem, 3vw, 2.7rem);
  line-height: 1.35;
  margin: 0;
}

.about-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(340px, 1.05fr);
  gap: 48px;
  align-items: start;
  margin-bottom: 72px;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.values-grid article,
.experience-grid article {
  background: #fff8e8;
  border: 1px solid rgba(16, 40, 32, 0.08);
  border-radius: 28px;
  padding: 28px;
  box-shadow: 0 14px 34px rgba(16, 40, 32, 0.06);
}

.values-grid article span {
  display: block;
  background: transparent;
  color: #8a5a24;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 22px;
}

.values-grid h3,
.experience-grid h3 {
  font-family: Georgia, "Times New Roman", serif;
  color: #102820;
  font-size: 1.28rem;
  margin: 0 0 12px;
}

.values-grid p {
  color: #51665b;
  line-height: 1.7;
  margin: 0;
}

.experience-section {
  background: #102820;
  color: #fff8e8;
  border-radius: 36px;
  padding: 48px;
  margin-bottom: 72px;
  box-shadow: 0 18px 45px rgba(16, 40, 32, 0.16);
}

.experience-section .eyebrow {
  color: #d8a05d;
}

.experience-section h2 {
  color: #fff8e8;
  max-width: 760px;
}

.experience-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 34px;
}

.experience-grid article {
  background: rgba(255, 248, 232, 0.08);
  border-color: rgba(255, 248, 232, 0.12);
  box-shadow: none;
}

.experience-grid h3 {
  color: #fff8e8;
}

.experience-grid p {
  color: rgba(255, 248, 232, 0.78);
  margin: 0;
}

.closing-section {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.closing-section p:last-child {
  max-width: 760px;
  margin: 0 auto;
}

@media (max-width: 980px) {
  .about-hero,
  .story-section,
  .about-layout {
    grid-template-columns: 1fr;
  }

  .about-hero-card {
    min-height: 260px;
  }

  .story-image-card,
  .image-placeholder {
    min-height: 360px;
  }

  .experience-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .about-page {
    padding: 36px 18px 72px;
  }

  .about-hero-copy,
  .about-hero-card,
  .experience-section {
    padding: 32px 24px;
    border-radius: 28px;
  }

  .story-section,
  .about-layout,
  .about-hero {
    gap: 28px;
    margin-bottom: 56px;
  }

  .values-grid {
    grid-template-columns: 1fr;
  }

  .quote-section {
    padding: 34px 12px;
    margin-bottom: 56px;
  }

  .experience-section {
    margin-bottom: 56px;
  }
}

@media (max-width: 520px) {
  .about-hero-copy,
  .about-hero-card,
  .experience-section,
  .values-grid article,
  .experience-grid article {
    padding: 24px 20px;
    border-radius: 22px;
  }

  .about-hero h1 {
    font-size: clamp(2.1rem, 12vw, 3rem);
  }

  .story-copy h2,
  .about-copy h2,
  .experience-section h2,
  .closing-section h2 {
    font-size: clamp(1.8rem, 10vw, 2.4rem);
  }

  .hero-text,
  .story-copy p,
  .about-copy p,
  .experience-grid p,
  .closing-section p {
    font-size: 0.98rem;
  }

  .story-image-card,
  .image-placeholder {
    min-height: 280px;
  }

  .image-placeholder {
    padding: 24px;
  }

  .quote-section p {
    font-size: clamp(1.45rem, 8vw, 2rem);
  }
}

</style>