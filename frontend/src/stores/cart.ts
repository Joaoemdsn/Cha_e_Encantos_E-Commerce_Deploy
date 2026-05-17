import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export interface Product {
  id: string
  name: string
  category: string
  tag: string
  price: number
  weight: string
  ingredients: string
  description: string
  image: string
}

export interface CartItem {
  product: Product
  quantity: number
}

const STORAGE_KEY = 'cha_e_encantos_cart'

const loadInitialItems = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(loadInitialItems())

  const cart = computed<Record<string, number>>(() => {
    return items.value.reduce<Record<string, number>>((acc, item) => {
      acc[item.product.id] = item.quantity
      return acc
    }, {})
  })

  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const total = computed(() => {
    return items.value.reduce((total, item) => {
      return total + item.product.price * item.quantity
    }, 0)
  })

  watch(
    items,
    (currentItems) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentItems))
    },
    { deep: true }
  )

  const addToCart = (product: Product, quantity = 1) => {
    const safeQuantity = Math.max(1, Number(quantity) || 1)
    const existingItem = items.value.find((item) => item.product.id === product.id)

    if (existingItem) {
      existingItem.quantity += safeQuantity
    } else {
      items.value.push({ product, quantity: safeQuantity })
    }
  }

  const increaseQuantity = (productId: string) => {
    const item = items.value.find((item) => item.product.id === productId)
    if (item) {
      item.quantity++
    }
  }

  const decreaseQuantity = (productId: string) => {
    const item = items.value.find((item) => item.product.id === productId)
    if (!item) return

    item.quantity--
    if (item.quantity <= 0) {
      removeItem(productId)
    }
  }

  const removeItem = (productId: string) => {
    items.value = items.value.filter((item) => item.product.id !== productId)
  }

  const clearCart = () => {
    items.value = []
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    items,
    cart,
    itemCount,
    total,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
  }
})
