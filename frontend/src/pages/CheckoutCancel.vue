<template>
  <section class="view content-view is-active checkout-result">
    <div class="profile-card result-card">
      <p class="eyebrow">Pagamento cancelado</p>
      <h2>Você voltou antes de concluir</h2>
      <p>O pedido ficou pendente. Você pode tentar novamente adicionando os itens ao carrinho.</p>
      <div class="result-actions">
        <router-link class="button primary" to="/catalogo">Voltar ao catálogo</router-link>
        <router-link class="button secondary" to="/perfil">Ver meu perfil</router-link>
      </div>
    </div>
  </section>
</template>
