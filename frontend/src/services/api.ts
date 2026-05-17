import axios, { AxiosInstance } from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const authService = {
  register: (email: string, password: string, name: string) => api.post('/auth/register', { email, password, name }),
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (email: string, token: string, password: string) => api.post('/auth/reset-password', { email, token, password }),
}

export const productService = {
  getAll: () => api.get('/products'),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (product: any) => api.post('/products', product),
  update: (id: string, product: any) => api.put(`/products/${id}`, product),
  remove: (id: string) => api.delete(`/products/${id}`),
}

export const orderService = {
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (order: any) => api.post('/orders', order),
  checkout: (items: any[]) => api.post('/orders/checkout', { items }),
  getCheckoutSession: (sessionId: string) => api.get(`/orders/checkout/session/${sessionId}`),
}

export const activityService = {
  getAll: () => api.get('/activities'),
  getById: (id: string) => api.get(`/activities/${id}`),
  create: (activity: any) => api.post('/activities', activity),
  update: (id: string, activity: any) => api.put(`/activities/${id}`, activity),
  createSlot: (activityId: string, slot: any) => api.post(`/activities/${activityId}/slots`, slot),
  book: (activityId: string, slotId: string) => api.post('/bookings', { activityId, slotId }),
}

export const favoriteService = {
  getAll: () => api.get('/favorites'),
  toggle: (productId: string) => api.post('/favorites/toggle', { productId }),
  remove: (productId: string) => api.delete(`/favorites/${productId}`),
}

export const reviewService = {
  product: (productId: string, rating: number, comment: string) => api.post(`/reviews/products/${productId}`, { rating, comment }),
  activity: (activityId: string, rating: number, comment: string) => api.post(`/reviews/activities/${activityId}`, { rating, comment }),
}

export const subscriptionService = {
  getPlans: () => api.get('/subscriptions/plans'),
  getMy: () => api.get('/subscriptions/my'),
  checkout: (planId: string) => api.post('/subscriptions/checkout', { planId }),
}

export const profileService = {
  getMe: () => api.get('/profile/me'),
}

export const adminService = {
  overview: () => api.get('/admin/overview'),
  orders: () => api.get('/admin/orders'),
  updateOrderStatus: (id: string, status: string) => api.patch(`/admin/orders/${id}/status`, { status }),
  bookings: () => api.get('/admin/bookings'),
  subscriptions: () => api.get('/admin/subscriptions'),
  createSubscriptionPlan: (plan: any) => api.post('/admin/subscription-plans', plan),
}

export default api
