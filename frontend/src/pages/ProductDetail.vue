<template>
  <main class="product-page">
    <section v-if="product" class="product-detail">
      <div class="product-image-card">
        <img
          :src="product.image"
          :alt="product.name"
          class="product-image"
        />
      </div>

      <div class="product-info">
        <span v-if="product.tag" class="product-tag">
          {{ product.tag }}
        </span>

        <h1>{{ product.name }}</h1>

        <p class="product-description">
          {{ product.description }}
        </p>

        <div class="product-meta-grid">
          <div v-if="product.weight" class="product-meta-card">
            <span>Peso</span>
            <strong>{{ product.weight }}</strong>
          </div>

          <div v-if="product.category" class="product-meta-card">
            <span>Categoria</span>
            <strong>{{ product.category }}</strong>
          </div>
        </div>

        <div v-if="product.ingredients" class="product-ingredients">
          <span>Ingredientes</span>
          <p>{{ product.ingredients }}</p>
        </div>

        <p class="product-price">
          R$ {{ formatPrice(product.price) }}
        </p>

        <div class="purchase-row">
          <div class="quantity-control">
            <button type="button" @click="decreaseQuantity">
              -
            </button>

            <span>{{ quantity }}</span>

            <button type="button" @click="increaseQuantity">
              +
            </button>
          </div>

          <button class="add-cart-button" @click="handleAddToCart">
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </section>

    <section v-if="product" class="reviews-section">
      <div class="reviews-header">
        <div>
          <span class="section-kicker">Opiniões dos clientes</span>
          <h2>Avaliações do produto</h2>
        </div>

        <div class="rating-summary" v-if="reviews.length">
          <strong>{{ averageRating.toFixed(1) }}</strong>
          <span>de 5 estrelas</span>
        </div>
      </div>

      <form class="review-form" @submit.prevent="submitReview">
        <h3>Deixe sua avaliação</h3>

        <div class="stars-input">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            class="star-button"
            :class="{ active: reviewForm.rating >= star }"
            @click="reviewForm.rating = star"
          >
            ★
          </button>
        </div>

        <textarea
          v-model="reviewForm.comment"
          placeholder="Conte o que achou deste chá..."
          rows="4"
        />

        <button class="submit-review-button" type="submit">
          Enviar avaliação
        </button>
      </form>

      <div class="reviews-list">
        <article
          v-for="review in reviews"
          :key="review.id"
          class="review-card"
        >
          <div class="review-card-header">
            <strong>{{ review.user?.name || 'Cliente' }}</strong>

            <div class="review-stars">
              <span
                v-for="star in 5"
                :key="star"
                :class="{ filled: star <= review.rating }"
              >
                ★
              </span>
            </div>
          </div>

          <p>{{ review.comment }}</p>
        </article>

        <p v-if="!reviews.length" class="empty-reviews">
          Este produto ainda não possui avaliações.
        </p>
      </div>
    </section>

    <section v-if="loading" class="product-loading">
      Carregando produto...
    </section>

    <section v-if="error" class="product-loading">
      {{ error }}
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'
import { useCartStore } from '../stores/cart'

type Product = {
  id: string
  name: string
  description: string
  price: number | string
  image: string
  tag?: string
  category?: string
  weight?: string
  ingredients?: string
}

type Review = {
  id: string
  rating: number
  comment: string
  user?: {
    name: string
  }
}

const route = useRoute()
const cartStore = useCartStore()

const product = ref<Product | null>(null)
const reviews = ref<Review[]>([])
const loading = ref(false)
const error = ref('')
const quantity = ref(1)

const reviewForm = reactive({
  rating: 5,
  comment: ''
})

const productId = computed(() => String(route.params.id))

const averageRating = computed(() => {
  if (!reviews.value.length) return 0

  const total = reviews.value.reduce((sum, review) => {
    return sum + Number(review.rating)
  }, 0)

  return total / reviews.value.length
})

function formatPrice(price: number | string) {
  return Number(price).toFixed(2).replace('.', ',')
}

function increaseQuantity() {
  quantity.value += 1
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value -= 1
  }
}

function handleAddToCart() {
  if (!product.value) return

  cartStore.addToCart({
    id: product.value.id,
    name: product.value.name,
    price: Number(product.value.price),
    image: product.value.image,
    category: product.value.category ?? '',
    tag: product.value.tag ?? '',
    weight: product.value.weight ?? '',
    ingredients: product.value.ingredients ?? '',
    description: product.value.description
  }, quantity.value)
}

async function loadProduct() {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get(`/products/${productId.value}`)
    product.value = response.data
  } catch (err) {
    error.value = 'Não foi possível carregar o produto.'
  } finally {
    loading.value = false
  }
}

async function loadReviews() {
  try {
    const response = await api.get(`/products/${productId.value}/reviews`)
    reviews.value = response.data
  } catch (err) {
    reviews.value = []
  }
}

async function submitReview() {
  if (!reviewForm.rating) {
    alert('Selecione uma nota de 1 a 5 estrelas.')
    return
  }

  if (!reviewForm.comment.trim()) {
    alert('Escreva um comentário para enviar sua avaliação.')
    return
  }

  try {
    await api.post(`/products/${productId.value}/reviews`, {
      rating: reviewForm.rating,
      comment: reviewForm.comment
    })

    reviewForm.rating = 5
    reviewForm.comment = ''

    await loadReviews()
  } catch (err) {
    alert('Não foi possível enviar a avaliação. Faça login e tente novamente.')
  }
}

onMounted(async () => {
  await loadProduct()
  await loadReviews()
})
</script>

<style scoped>
.product-page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 56px 24px 80px;
}

.product-detail {
  display: grid;
  grid-template-columns: minmax(320px, 500px) 1fr;
  gap: 56px;
  align-items: start;
}

.product-image-card {
  width: 100%;
  max-width: 500px;
  border-radius: 32px;
  overflow: hidden;
  background: #f5efe4;
  box-shadow: 0 18px 45px rgba(16, 40, 32, 0.12);
}

.product-image {
  width: 100%;
  height: 430px;
  display: block;
  object-fit: cover;
}

.product-info {
  padding-top: 8px;
}

.product-tag {
  display: inline-block;
  background: rgba(216, 160, 93, 0.18);
  color: #8a5a24;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.product-info h1 {
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2.4rem, 4vw, 4.1rem);
  line-height: 1.05;
  color: #102820;
  margin: 0 0 22px;
}

.product-description {
  color: #51665b;
  font-size: 1.08rem;
  line-height: 1.8;
  margin: 0 0 24px;
  max-width: 620px;
}

.product-meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  max-width: 520px;
  margin-bottom: 18px;
}

.product-meta-card {
  background: #fff8e8;
  border: 1px solid rgba(16, 40, 32, 0.08);
  border-radius: 18px;
  padding: 14px 16px;
}

.product-meta-card span,
.product-ingredients span {
  display: block;
  color: #d8a05d;
  font-size: 0.82rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.product-meta-card strong {
  color: #102820;
  font-size: 0.98rem;
}

.product-ingredients {
  max-width: 620px;
  background: rgba(245, 239, 228, 0.78);
  border-radius: 20px;
  padding: 16px 18px;
  margin-bottom: 24px;
}

.product-ingredients p {
  color: #51665b;
  line-height: 1.6;
  margin: 0;
}

.product-price {
  color: #102820;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 26px;
}

.purchase-row {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}

.quantity-control {
  display: inline-flex;
  align-items: center;
  gap: 18px;
  background: #fff8e8;
  border: 1px solid rgba(16, 40, 32, 0.12);
  border-radius: 999px;
  padding: 6px 8px;
}

.quantity-control button {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background: #102820;
  color: #fff8e8;
  font-size: 1.15rem;
  font-weight: 700;
  cursor: pointer;
}

.quantity-control span {
  min-width: 20px;
  text-align: center;
  color: #102820;
  font-weight: 700;
}

.add-cart-button,
.submit-review-button {
  border: none;
  border-radius: 999px;
  background: #102820;
  color: #fff8e8;
  padding: 14px 24px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.add-cart-button:hover,
.submit-review-button:hover,
.quantity-control button:hover {
  transform: translateY(-2px);
  opacity: 0.92;
}

.reviews-section {
  margin-top: 72px;
  padding: 40px;
  border-radius: 32px;
  background: #fff8e8;
  box-shadow: 0 16px 42px rgba(16, 40, 32, 0.08);
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-start;
  margin-bottom: 32px;
}

.section-kicker {
  display: inline-block;
  color: #d8a05d;
  font-weight: 700;
  margin-bottom: 8px;
}

.reviews-header h2 {
  font-family: Georgia, "Times New Roman", serif;
  color: #102820;
  font-size: 2rem;
  margin: 0;
}

.rating-summary {
  text-align: right;
  color: #51665b;
}

.rating-summary strong {
  display: block;
  color: #102820;
  font-size: 2rem;
}

.review-form {
  display: grid;
  gap: 16px;
  padding: 24px;
  border-radius: 24px;
  background: #f5efe4;
  margin-bottom: 28px;
}

.review-form h3 {
  margin: 0;
  color: #102820;
  font-family: Georgia, "Times New Roman", serif;
}

.stars-input {
  display: flex;
  gap: 6px;
}

.star-button {
  border: none;
  background: transparent;
  color: #c8bda8;
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0;
}

.star-button.active {
  color: #d8a05d;
}

.review-form textarea {
  width: 100%;
  resize: vertical;
  border: 1px solid rgba(16, 40, 32, 0.16);
  border-radius: 18px;
  padding: 14px 16px;
  font-family: inherit;
  font-size: 1rem;
  background: #fff;
  color: #102820;
}

.reviews-list {
  display: grid;
  gap: 16px;
}

.review-card {
  padding: 22px;
  border-radius: 22px;
  background: #ffffff;
  border: 1px solid rgba(16, 40, 32, 0.08);
}

.review-card-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 10px;
}

.review-stars span {
  color: #c8bda8;
}

.review-stars span.filled {
  color: #d8a05d;
}

.review-card p {
  color: #51665b;
  line-height: 1.6;
  margin: 0;
}

.empty-reviews {
  color: #51665b;
  margin: 0;
}

.product-loading {
  text-align: center;
  padding: 80px 24px;
  color: #51665b;
}

@media (max-width: 900px) {
  .product-detail {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .product-image-card {
    max-width: 100%;
  }

  .product-image {
    height: 420px;
  }

  .reviews-header {
    flex-direction: column;
  }

  .rating-summary {
    text-align: left;
  }
}

@media (max-width: 640px) {
  .product-page {
    padding: 36px 18px 64px;
  }

  .product-image {
    height: 320px;
  }

  .product-meta-grid {
    grid-template-columns: 1fr;
  }

  .purchase-row {
    align-items: stretch;
    flex-direction: column;
  }

  .quantity-control {
    width: fit-content;
  }

  .add-cart-button {
    width: 100%;
  }

  .reviews-section {
    padding: 24px;
    border-radius: 24px;
  }

  .review-form {
    padding: 20px;
  }

  .review-card-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>