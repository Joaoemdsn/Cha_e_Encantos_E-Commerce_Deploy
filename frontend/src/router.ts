import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Catalogo from './pages/Catalogo.vue'
import Sobre from './pages/Sobre.vue'
import Atividades from './pages/Atividades.vue'
import ProductDetail from './pages/ProductDetail.vue'
import Auth from './pages/Auth.vue'
import Perfil from './pages/Perfil.vue'
import CheckoutSuccess from './pages/CheckoutSuccess.vue'
import CheckoutCancel from './pages/CheckoutCancel.vue'
import Assinatura from './pages/Assinatura.vue'
import Admin from './pages/Admin.vue'
import Contato from './pages/Contato.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/catalogo', name: 'Catalogo', component: Catalogo },
  { path: '/produto/:id', name: 'ProductDetail', component: ProductDetail },
  { path: '/sobre', name: 'Sobre', component: Sobre },
  { path: '/atividades', name: 'Atividades', component: Atividades },
  { path: '/assinatura', name: 'Assinatura', component: Assinatura },
  { path: '/login', name: 'Auth', component: Auth },
  { path: '/perfil', name: 'Perfil', component: Perfil, meta: { requiresAuth: true } },
  { path: '/admin', name: 'Admin', component: Admin, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/checkout/sucesso', name: 'CheckoutSuccess', component: CheckoutSuccess, meta: { requiresAuth: true } },
  { path: '/checkout/cancelado', name: 'CheckoutCancel', component: CheckoutCancel, meta: { requiresAuth: true } },
  { path: '/contato', name: 'Contato', component: Contato }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to) => {
  const token = localStorage.getItem('auth_token')
  const user = localStorage.getItem('user')
  const parsedUser = user ? JSON.parse(user) : null
  if (to.meta.requiresAuth && !token) return { name: 'Auth', query: { redirect: to.fullPath } }
  if (to.meta.requiresAdmin && parsedUser?.role !== 'admin') return { name: 'Home' }
})

export default router
