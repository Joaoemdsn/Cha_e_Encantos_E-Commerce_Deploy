<template>
  <div id="app">
    <header class="site-header">
      <router-link class="brand" to="/">
        <img class="brand-mark" src="/logo-header.png" alt="" />
        <span>Chá e Encantos</span>
      </router-link>

      <button
        class="menu-toggle"
        type="button"
        @click="toggleMenu"
        :aria-expanded="isMenuOpen"
        aria-controls="main-navigation"
        aria-label="Abrir menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav id="main-navigation" class="main-nav" :class="{ 'is-open': isMenuOpen }" aria-label="Principal">
        <router-link to="/" @click="closeMenu">Início</router-link>
        <router-link to="/sobre" @click="closeMenu">Nossa História</router-link>
        <router-link to="/catalogo" @click="closeMenu">Catálogo</router-link>
        <router-link to="/contato" @click="closeMenu">Contato</router-link>
        <router-link to="/atividades" @click="closeMenu">Atividades</router-link>
        <router-link to="/assinatura" @click="closeMenu">Assinatura</router-link>
        <router-link v-if="authStore.isAdmin" to="/admin" @click="closeMenu">Admin</router-link>
        <router-link v-if="authStore.isAuthenticated" to="/perfil" @click="closeMenu">Perfil</router-link>
        <router-link v-if="!authStore.isAuthenticated" to="/login" @click="closeMenu">Entrar</router-link>
        <button v-else class="nav-button" type="button" @click="handleLogout">Sair</button>
      </nav>

      <button class="cart-button" type="button" @click="openCart" aria-label="Abrir carrinho">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 9h10l-1 10H8L7 9Z" />
          <path d="M9 9a3 3 0 0 1 6 0" />
        </svg>
        <strong>{{ cartStore.itemCount }}</strong>
      </button>
    </header>

    <main>
      <router-view />
    </main>

    <footer class="site-footer">
  <div class="footer-container">
    <div class="footer-brand">
      <div class="footer-logo">
        <img class="footer-mark" src="/logo-footer.svg" alt="" aria-hidden="true" />
      </div>

      <div>
        <h2>Chá e Encantos</h2>
        <p>Infusões botânicas que trazem magia e aconchego para o seu dia a dia.</p>
        <p>Feito com amor e natureza.</p>
      </div>
    </div>

    <div class="footer-grid">
      <div class="footer-column">
        <h3>Contato</h3>
        <p>WhatsApp: (86) 99984-2026</p>
        <p>Email: contato@chaeencantos.com.br</p>
        <p>Telefone: (86) 3221-4587</p>
      </div>

      <div class="footer-column">
        <h3>Endereço</h3>
        <p>Rua das Ervas, 124</p>
        <p>Centro, Teresina - PI</p>
        <p>CEP: 64000-120</p>
      </div>

      <div class="footer-column">
        <h3>Atendimento</h3>
        <p>Segunda a sexta: 08h às 18h</p>
        <p>Sábado: 09h às 14h</p>
        <p>Domingo: fechado</p>
      </div>

      <div class="footer-column">
        <h3>Redes sociais</h3>
        <p>Instagram: @chaeencantos</p>
        <p>Facebook: Chá e Encantos</p>
        <p>TikTok: @chaeencantos</p>
      </div>
    </div>

    <div class="footer-bottom">
      <p>Chá & Encantos. Todos os direitos reservados.</p>
      <p>CNPJ: 12.345.678/0001-90</p>
    </div>
  </div>
</footer>
    <!-- Cart Drawer -->
    <aside class="cart-drawer" :class="{ 'is-open': isCartOpen }" :aria-hidden="!isCartOpen">
      <div class="cart-panel">
        <div class="cart-header">
          <div>
            <p class="eyebrow">Pedido</p>
            <h2>Carrinho</h2>
          </div>
          <button class="icon-button" type="button" @click="closeCart" aria-label="Fechar carrinho">x</button>
        </div>

        <div class="cart-items">
          <p v-if="cartStore.items.length === 0" class="empty-cart">Seu carrinho está vazio.</p>
          <article v-for="item in cartStore.items" :key="item.product.id" class="cart-item">
            <div>
              <h3>{{ item.product.name }}</h3>
              <p>{{ formatPrice(item.product.price) }} - {{ item.product.weight }}</p>
            </div>
            <div class="quantity">
              <button type="button" @click="cartStore.decreaseQuantity(item.product.id)">-</button>
              <strong>{{ item.quantity }}</strong>
              <button type="button" @click="cartStore.increaseQuantity(item.product.id)">+</button>
            </div>
          </article>
        </div>

        <div class="cart-footer">
          <div class="cart-total">
            <span>Total</span>
            <strong>{{ formatPrice(cartStore.total) }}</strong>
          </div>
          <button class="button primary full" type="button" @click="handleCheckout">Finalizar pedido</button>
          <p class="checkout-note" role="status">{{ checkoutMessage }}</p>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from './stores/cart'
import { useAuthStore } from './stores/auth'
import { orderService } from './services/api'

const route = useRoute()
const cartStore = useCartStore()
const authStore = useAuthStore()
const isCartOpen = ref(false)
const isMenuOpen = ref(false)
const checkoutMessage = ref('')

const openCart = () => {
  isCartOpen.value = true
}

const closeCart = () => {
  isCartOpen.value = false
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleLogout = () => {
  authStore.logout()
  closeMenu()
}

watch(
  () => route.fullPath,
  () => {
    closeMenu()
  }
)

const handleCheckout = async () => {
  if (cartStore.items.length === 0) {
    checkoutMessage.value = 'Adicione produtos para continuar.'
    return
  }

  if (!authStore.isAuthenticated) {
    checkoutMessage.value = 'Faça login para finalizar o pedido.'
    return
  }

  try {
    checkoutMessage.value = 'Redirecionando para o pagamento seguro...'
    const response = await orderService.checkout(
      cartStore.items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }))
    )

    if (response.data.checkoutUrl) {
      window.location.href = response.data.checkoutUrl
      return
    }

    checkoutMessage.value = 'Não foi possível abrir o checkout da Stripe.'
  } catch (error: any) {
    checkoutMessage.value = error.response?.data?.error || 'Erro ao finalizar pedido.'
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(price)
}
</script>

<style scoped>
/* Estilos serão importados de um arquivo CSS global */
</style>
