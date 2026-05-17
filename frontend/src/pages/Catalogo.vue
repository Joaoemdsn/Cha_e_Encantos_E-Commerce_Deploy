<template>
  <section class="view content-view is-active">
    <div class="section-heading">
      <p class="eyebrow">Catálogo</p>
      <h2>Escolha seu blend</h2>
      <p>Produtos prontos com carrinho funcional integrado ao backend.</p>
    </div>

    <div class="filters" role="list" aria-label="Filtros de categoria">
      <button
        v-for="category in categories"
        :key="category"
        :class="{ 'is-active': activeFilter === category }"
        type="button"
        @click="activeFilter = category"
        class="filter"
      >
        {{ formatCategory(category) }}
      </button>
    </div>

    <div class="product-grid">
      <article v-for="product in filteredProducts" :key="product.id" class="product-card">
        <div class="product-media" @click="navigateToProduct(product.id)" style="cursor: pointer;">
          <img :src="product.image" :alt="product.name" />
          <div class="favorite-actions">
            <button class="favorite-action" :class="{ 'is-favorite': favoritesStore.isFavorite(product.id) }" type="button" aria-label="Marcar como favorito" @click.stop="handleFavorite(product.id)">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
              </svg>
            </button>
            <button
              class="quick-view"
              type="button"
              @click.stop="cartStore.addToCart(product)"
              aria-label="Adicionar ao carrinho"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>
        <div class="product-body">
          <div class="product-meta">
            <div>
              <span class="tag">{{ product.tag }}</span>
              <h3>{{ product.name }}</h3>
            </div>
            <strong class="price">{{ formatPrice(product.price) }}</strong>
          </div>
          <p>{{ product.description }}</p>
          <div class="product-details">
            <span>{{ product.weight }}</span>
            <span>{{ product.ingredients }}</span>
          </div>
          <div class="product-card-actions">
            <button class="button primary" type="button" @click="navigateToProduct(product.id)">
              Ver Detalhes
            </button>
            <button class="button secondary" type="button" @click="cartStore.addToCart(product)">
              Adicionar
            </button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useFavoritesStore } from '../stores/favorites'
import { productService } from '../services/api'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()
const activeFilter = ref('todos')
const products = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const categories = ref(['todos', 'relaxar', 'energia', 'digestivo', 'floral'])

const filteredProducts = computed(() => {
  if (activeFilter.value === 'todos') {
    return products.value
  }
  return products.value.filter((p) => p.category === activeFilter.value)
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(price)
}

const formatCategory = (category: string) => {
  const map: Record<string, string> = {
    todos: 'Todos',
    relaxar: 'Relaxar',
    energia: 'Energia',
    digestivo: 'Digestivo',
    floral: 'Floral',
  }
  return map[category] || category
}

const navigateToProduct = (productId: string) => {
  router.push({ name: 'ProductDetail', params: { id: productId } })
}

const handleFavorite = async (productId: string) => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Auth', query: { redirect: '/catalogo' } })
    return
  }

  await favoritesStore.toggleFavorite(productId)
}

const loadProducts = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await productService.getAll()
    products.value = response.data
  } catch (err) {
    console.error('Erro ao carregar produtos:', err)
    error.value = 'Erro ao carregar produtos'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProducts()
  if (authStore.isAuthenticated) {
    favoritesStore.loadFavorites()
  }
})
</script>

<style scoped>
/* Estilos herdados da folha de estilos global */
</style>
