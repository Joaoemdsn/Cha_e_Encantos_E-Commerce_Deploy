<template>
  <section class="view content-view is-active checkout-result">
    <div class="profile-card result-card">
      <p class="eyebrow">Pagamento</p>
      <h2>Pedido recebido</h2>
      <p>{{ message }}</p>
      <div class="result-actions">
        <router-link class="button primary" to="/perfil">Ver meu perfil</router-link>
        <router-link class="button secondary" to="/catalogo">Continuar comprando</router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { orderService } from '../services/api'
import { useCartStore } from '../stores/cart'

const route = useRoute()
const cartStore = useCartStore()
const message = ref('Confirmando seu pagamento...')

onMounted(async () => {
  cartStore.clearCart()
  const sessionId = route.query.session_id as string | undefined
  if (!sessionId) {
    message.value = 'Seu pedido foi criado. A confirmação do pagamento aparecerá no perfil.'
    return
  }

  try {
    await orderService.getCheckoutSession(sessionId)
    message.value = 'Seu pagamento foi iniciado com sucesso. Assim que a Stripe confirmar, o pedido aparecerá como pago no perfil.'
  } catch {
    message.value = 'Seu pedido foi criado. A confirmação do pagamento aparecerá no perfil em instantes.'
  }
})
</script>
