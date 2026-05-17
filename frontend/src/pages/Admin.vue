<template>
  <section class="view content-view is-active admin-view">
    <div class="section-heading">
      <p class="eyebrow">Administração</p>
      <h2>Painel da loja</h2>
      <p>Cadastre produtos, acompanhe pedidos, reservas e assinaturas.</p>
    </div>

    <div v-if="!authStore.isAdmin" class="profile-state error">Acesso restrito ao administrador.</div>
    <div v-else class="admin-layout">
      <div class="admin-stats">
        <article v-for="(value, key) in overview" :key="key" class="profile-card stat-card"><span>{{ labels[key] || key }}</span><strong>{{ key === 'paidRevenue' ? formatPrice(value) : value }}</strong></article>
      </div>

      <section class="profile-card admin-section">
        <h3>Novo produto</h3>
        <form class="admin-form" @submit.prevent="createProduct">
          <input v-model="productForm.name" placeholder="Nome" required />
          <input v-model="productForm.category" placeholder="Categoria" required />
          <input v-model="productForm.tag" placeholder="Tag" required />
          <input v-model.number="productForm.price" type="number" placeholder="Preço" required />
          <input v-model="productForm.weight" placeholder="Peso" required />
          <input v-model="productForm.ingredients" placeholder="Ingredientes" required />
          <input v-model="productForm.image" placeholder="Imagem ex: /hero-tea-cup.png" required />
          <textarea v-model="productForm.description" placeholder="Descrição" required></textarea>
          <button class="button primary" type="submit">Cadastrar produto</button>
        </form>
      </section>

      <section class="profile-card admin-section">
        <h3>Nova atividade</h3>
        <form class="admin-form" @submit.prevent="createActivity">
          <input v-model="activityForm.title" placeholder="Título" required />
          <input v-model="activityForm.duration" placeholder="Duração" required />
          <input v-model.number="activityForm.price" type="number" placeholder="Preço" required />
          <textarea v-model="activityForm.description" placeholder="Descrição" required></textarea>
          <button class="button primary" type="submit">Cadastrar atividade</button>
        </form>
      </section>

      <section class="profile-card admin-section">
        <h3>Pedidos</h3>
        <div class="history-list">
          <article v-for="order in orders" :key="order.id" class="history-item">
            <div><strong>#{{ shortId(order.id) }} · {{ order.user.name }}</strong><p>{{ order.items.map((item:any) => `${item.quantity}x ${item.product.name}`).join(', ') }}</p><small>{{ formatDate(order.createdAt) }}</small></div>
            <div class="history-side"><strong>{{ formatPrice(order.total) }}</strong><select :value="order.status" @change="updateOrderStatus(order.id, ($event.target as HTMLSelectElement).value)"><option value="pending">Pendente</option><option value="paid">Pago</option><option value="shipped">Enviado</option><option value="delivered">Entregue</option><option value="cancelled">Cancelado</option></select></div>
          </article>
        </div>
      </section>

      <section class="profile-card admin-section">
        <h3>Reservas</h3>
        <div class="history-list"><article v-for="booking in bookings" :key="booking.id" class="history-item"><div><strong>{{ booking.activity.title }}</strong><p>{{ booking.user.name }} · {{ booking.user.email }}</p><small>{{ formatDate(booking.slot.dateTime) }}</small></div><span class="status-pill">{{ formatStatus(booking.status) }}</span></article></div>
      </section>

      <section class="profile-card admin-section">
        <h3>Assinaturas</h3>
        <div class="history-list"><article v-for="subscription in subscriptions" :key="subscription.id" class="history-item"><div><strong>{{ subscription.plan.name }}</strong><p>{{ subscription.user.name }} · {{ subscription.user.email }}</p><small>{{ formatDate(subscription.createdAt) }}</small></div><span class="status-pill">{{ formatStatus(subscription.status) }}</span></article></div>
      </section>

      <p class="form-status center">{{ status }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { adminService, activityService, productService } from '../services/api'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const overview = ref<Record<string, any>>({}); const orders = ref<any[]>([]); const bookings = ref<any[]>([]); const subscriptions = ref<any[]>([]); const status = ref('')
const labels: Record<string, string> = { products: 'Produtos', activities: 'Atividades', orders: 'Pedidos', bookings: 'Reservas', subscriptions: 'Assinaturas', users: 'Clientes', paidRevenue: 'Receita paga' }
const productForm = ref({ name: '', category: '', tag: '', price: 0, weight: '', ingredients: '', description: '', image: '/hero-tea-cup.png' })
const activityForm = ref({ title: '', duration: '', price: 0, description: '' })

const formatPrice = (price: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(price)
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
const shortId = (id: string) => id.slice(0, 8).toUpperCase()
const formatStatus = (status: string) => ({ pending: 'Pendente', paid: 'Pago', shipped: 'Enviado', delivered: 'Entregue', cancelled: 'Cancelado', confirmed: 'Confirmada', active: 'Ativa', canceled: 'Cancelada' } as Record<string, string>)[status] || status
const loadAdmin = async () => { if (!authStore.isAdmin) return; const [ov, o, b, s] = await Promise.all([adminService.overview(), adminService.orders(), adminService.bookings(), adminService.subscriptions()]); overview.value = ov.data; orders.value = o.data; bookings.value = b.data; subscriptions.value = s.data }
const createProduct = async () => { try { await productService.create(productForm.value); status.value = 'Produto cadastrado.'; productForm.value = { name: '', category: '', tag: '', price: 0, weight: '', ingredients: '', description: '', image: '/hero-tea-cup.png' }; await loadAdmin() } catch (error: any) { status.value = error.response?.data?.error || 'Erro ao cadastrar produto.' } }
const createActivity = async () => { try { await activityService.create(activityForm.value); status.value = 'Atividade cadastrada.'; activityForm.value = { title: '', duration: '', price: 0, description: '' }; await loadAdmin() } catch (error: any) { status.value = error.response?.data?.error || 'Erro ao cadastrar atividade.' } }
const updateOrderStatus = async (id: string, nextStatus: string) => { await adminService.updateOrderStatus(id, nextStatus); await loadAdmin() }
onMounted(loadAdmin)
</script>
