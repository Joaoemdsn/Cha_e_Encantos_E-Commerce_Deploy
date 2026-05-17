<template>
  <section class="view home-view is-active">
    <div class="home-hero">
      <div class="hero-copy">
        <h1>Sinta a magia em cada <em>gole</em>.</h1>
        <p>
          Descubra nossa coleção de chás selecionados. Blends exclusivos criados para
          aquecer a alma, acalmar a mente e encantar o seu dia.
        </p>
        <div class="hero-actions">
          <router-link to="/catalogo" class="button primary">
            Ver Catálogo
            <img class="cta-arrow" src="/arrow-cta.png" alt="" aria-hidden="true" />
          </router-link>
          <router-link to="/sobre" class="button secondary">Nossa História</router-link>
        </div>
      </div>

      <figure class="hero-photo">
        <img src="/hero-tea-cup.png" alt="Xícara de chá sobre tecido claro" />
      </figure>
    </div>

    <section class="benefits" aria-label="Diferenciais da loja">
      <article>
        <span class="benefit-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 20V9" />
            <path d="M12 15C 7 15 4 12 4 7c5 0 8 3 8 8Z" />
            <path d="M12 13c4 0 7-3 7-7-4 0-7 3-7 7Z" />
          </svg>
        </span>
        <h2>Ervas Selecionadas</h2>
        <p>Colhidas de forma sustentável e artesanal</p>
      </article>
      <article>
        <span class="benefit-icon text-icon">tea</span>
        <h2>Blends Mágicos</h2>
        <p>Combinações únicas para cada momento</p>
      </article>
      <article>
        <span class="benefit-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 8 12 4l8 4-8 4-8-4Z" />
            <path d="M4 8v8l8 4 8-4V8" />
            <path d="M12 12v8" />
          </svg>
        </span>
        <h2>Aconchego em Casa</h2>
        <p>Entregamos a experiência na porta da sua casa</p>
      </article>
    </section>

    <section class="favorites-section">
      <div class="section-heading">
        <h2>Os Favoritos da Casa</h2>
        <p>
          Descubra os blends que têm encantado nossos clientes. Cada caixa contém não
          apenas chá, mas um convite a uma pausa merecida.
        </p>
      </div>
      <div class="favorite-grid">
        <article v-for="product in favoriteProducts" :key="product.id" class="favorite-card" @click="navigateToProduct(product.id)" style="cursor: pointer;">
          <div class="favorite-media">
            <img :src="product.image" :alt="product.name" />
            <div class="favorite-actions">
              <button class="favorite-action" type="button" aria-label="Marcar como favorito">
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
          <div class="favorite-info">
            <h3>{{ product.name }}</h3>
            <p class="favorite-price">
              <strong>{{ formatPrice(product.price) }}</strong>
              <span class="stars" aria-label="4 de 5 estrelas">★★★★</span>
            </p>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { productService } from '../services/api'

const router = useRouter()
const cartStore = useCartStore()
const favoriteProducts = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(price)
}

const navigateToProduct = (productId: string) => {
  router.push({ name: 'ProductDetail', params: { id: productId } })
}

const loadFavorites = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await productService.getAll()
    // Pega os 4 primeiros produtos como favoritos
    favoriteProducts.value = response.data.slice(0, 4)
  } catch (err) {
    console.error('Erro ao carregar favoritos:', err)
    error.value = 'Erro ao carregar produtos'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadFavorites()
})
</script>

<style scoped>
/* Estilos herdados da folha de estilos global */
</style>
