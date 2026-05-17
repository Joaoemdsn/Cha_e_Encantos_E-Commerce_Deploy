<template>
  <section class="view content-view is-active profile-view">
    <div class="section-heading">
      <p class="eyebrow">Minha conta</p>
      <h2>Seu perfil</h2>
      <p>Veja seus chás favoritos, pedidos e reservas em um só lugar.</p>
    </div>

    <div v-if="loading" class="profile-state">Carregando perfil...</div>
    <div v-else-if="error" class="profile-state error">{{ error }}</div>

    <div v-else-if="profile" class="profile-layout">
      <aside class="profile-card account-card">
        <p class="eyebrow">Cliente</p>
        <h3>{{ profile.name }}</h3>
        <p>{{ profile.email }}</p>
        <small>Conta criada em {{ formatDate(profile.createdAt) }}</small>
      </aside>

      <div class="profile-content">
        <section class="profile-card">
          <div class="profile-section-header">
            <div>
              <p class="eyebrow">Favoritos</p>
              <h3>Chás salvos</h3>
            </div>
            <router-link class="button secondary compact" to="/catalogo">Explorar catálogo</router-link>
          </div>

          <p v-if="profile.favorites.length === 0" class="empty-profile">Você ainda não favoritou nenhum chá.</p>
          <div v-else class="mini-grid">
            <article v-for="favorite in profile.favorites" :key="favorite.id" class="mini-product">
              <img :src="favorite.product.image" :alt="favorite.product.name" />
              <div>
                <span class="tag">{{ favorite.product.tag }}</span>
                <h4>{{ favorite.product.name }}</h4>
                <p>{{ formatPrice(favorite.product.price) }}</p>
                <div class="mini-actions">
                  <router-link :to="`/produto/${favorite.product.id}`">Ver detalhes</router-link>
                  <button type="button" @click="removeFavorite(favorite.product.id)">Remover</button>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section class="profile-card">
          <p class="eyebrow">Compras</p>
          <h3>Pedidos</h3>
          <p v-if="profile.orders.length === 0" class="empty-profile">Nenhum pedido criado ainda.</p>
          <div v-else class="history-list">
            <article v-for="order in profile.orders" :key="order.id" class="history-item">
              <div>
                <strong>Pedido #{{ shortId(order.id) }}</strong>
                <p>{{ order.items.length }} item(ns) · {{ formatDate(order.createdAt) }}</p>
                <small>{{ formatOrderItems(order.items) }}</small>
              </div>
              <div class="history-side">
                <span class="status-pill">{{ formatStatus(order.status) }}</span>
                <strong>{{ formatPrice(order.total) }}</strong>
              </div>
            </article>
          </div>
        </section>

        <section class="profile-card">
          <p class="eyebrow">Experiências</p>
          <h3>Reservas</h3>
          <p v-if="profile.bookings.length === 0" class="empty-profile">Você ainda não tem reservas.</p>
          <div v-else class="history-list">
            <article v-for="booking in profile.bookings" :key="booking.id" class="history-item">
              <div>
                <strong>{{ booking.activity.title }}</strong>
                <p>{{ formatDate(booking.slot.dateTime) }}</p>
                <small>{{ booking.activity.duration }}</small>
              </div>
              <span class="status-pill">{{ formatStatus(booking.status) }}</span>
            </article>
          </div>
        </section>

        <section class="profile-card">
          <div class="profile-section-header">
            <div>
              <p class="eyebrow">Caixinhas</p>
              <h3>Assinaturas</h3>
            </div>
            <router-link class="button secondary compact" to="/assinatura">Ver planos</router-link>
          </div>
          <p v-if="!profile.subscriptions || profile.subscriptions.length === 0" class="empty-profile">Você ainda não tem caixinhas mensais ativas.</p>
          <div v-else class="history-list">
            <article v-for="subscription in profile.subscriptions" :key="subscription.id" class="history-item">
              <div>
                <strong>{{ subscription.plan.name }}</strong>
                <p>{{ formatPrice(subscription.plan.price) }} / mês</p>
                <small v-if="subscription.currentPeriodEnd">Renova em {{ formatDate(subscription.currentPeriodEnd) }}</small>
              </div>
              <span class="status-pill">{{ formatStatus(subscription.status) }}</span>
            </article>
          </div>
        </section>

        <section class="profile-card">
          <p class="eyebrow">Avaliações</p>
          <h3>Suas opiniões</h3>
          <p v-if="(!profile.productReviews || profile.productReviews.length === 0) && (!profile.activityReviews || profile.activityReviews.length === 0)" class="empty-profile">Você ainda não avaliou produtos ou atividades.</p>
          <div v-else class="history-list">
            <article v-for="review in profile.productReviews" :key="review.id" class="history-item">
              <div><strong>{{ review.product.name }}</strong><p>{{ stars(review.rating) }}</p><small>{{ review.comment || 'Sem comentário.' }}</small></div>
            </article>
            <article v-for="review in profile.activityReviews" :key="review.id" class="history-item">
              <div><strong>{{ review.activity.title }}</strong><p>{{ stars(review.rating) }}</p><small>{{ review.comment || 'Sem comentário.' }}</small></div>
            </article>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { profileService, favoriteService } from '../services/api'
import { useFavoritesStore } from '../stores/favorites'

const profile = ref<any>(null)
const loading = ref(false)
const error = ref('')
const favoritesStore = useFavoritesStore()

const loadProfile = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await profileService.getMe()
    profile.value = response.data
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Erro ao carregar perfil.'
  } finally {
    loading.value = false
  }
}

const removeFavorite = async (productId: string) => {
  await favoriteService.remove(productId)
  await favoritesStore.loadFavorites()
  await loadProfile()
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(price)

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

const shortId = (id: string) => id.slice(0, 8).toUpperCase()

const formatOrderItems = (items: any[]) => items.map((item) => `${item.quantity}x ${item.product.name}`).join(', ')

const stars = (rating: number) => '★'.repeat(Math.round(rating || 0)).padEnd(5, '☆')

const formatStatus = (status: string) => {
  const map: Record<string, string> = {
    pending: 'Pendente',
    paid: 'Pago',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
    confirmed: 'Confirmada',
    failed: 'Falhou',
    expired: 'Expirou',
    active: 'Ativa',
    canceled: 'Cancelada',
    incomplete: 'Incompleta',
    past_due: 'Pagamento pendente',
  }
  return map[status] || status
}

onMounted(() => {
  loadProfile()
})
</script>
