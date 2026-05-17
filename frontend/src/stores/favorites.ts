import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { favoriteService } from '../services/api'

export const useFavoritesStore = defineStore('favorites', () => {
  const productIds = ref<string[]>([])
  const favorites = ref<any[]>([])
  const loading = ref(false)

  const favoriteSet = computed(() => new Set(productIds.value))

  const loadFavorites = async () => {
    loading.value = true
    try {
      const response = await favoriteService.getAll()
      favorites.value = response.data
      productIds.value = response.data.map((favorite: any) => favorite.productId)
    } finally {
      loading.value = false
    }
  }

  const isFavorite = (productId: string) => favoriteSet.value.has(productId)

  const toggleFavorite = async (productId: string) => {
    const response = await favoriteService.toggle(productId)
    if (response.data.favorited) {
      productIds.value = Array.from(new Set([...productIds.value, productId]))
      if (response.data.favorite) {
        favorites.value.unshift(response.data.favorite)
      }
    } else {
      productIds.value = productIds.value.filter((id) => id !== productId)
      favorites.value = favorites.value.filter((favorite: any) => favorite.productId !== productId)
    }
    return response.data
  }

  const clear = () => {
    productIds.value = []
    favorites.value = []
  }

  return { productIds, favorites, loading, loadFavorites, isFavorite, toggleFavorite, clear }
})
