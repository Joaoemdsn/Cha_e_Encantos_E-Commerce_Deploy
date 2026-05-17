<template>
  <section class="view content-view is-active subscription-view">
    <div class="section-heading">
      <p class="eyebrow">Assinatura</p>
      <h2>Caixinhas mensais de chá</h2>
      <p>Receba em casa uma curadoria mensal com blends, aromas e pequenos encantos botânicos.</p>
    </div>

    <div class="subscription-grid">
      <article v-for="plan in plans" :key="plan.id" class="subscription-card">
        <p class="eyebrow">Plano mensal</p>
        <h3>{{ plan.name }}</h3>
        <strong class="subscription-price">{{ formatPrice(plan.price) }} / mês</strong>
        <p>{{ plan.description }}</p>
        <ul>
          <li v-for="benefit in plan.benefits" :key="benefit">{{ benefit }}</li>
        </ul>
        <button class="button primary full" type="button" @click="subscribe(plan.id)">Assinar caixinha</button>
      </article>
    </div>

    <p class="form-status center" role="status">{{ status }}</p>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { subscriptionService } from '../services/api'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const plans = ref<any[]>([])
const status = ref('')

const formatPrice = (price: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(price)

const loadPlans = async () => {
  const response = await subscriptionService.getPlans()
  plans.value = response.data
}

const subscribe = async (planId: string) => {
  if (!authStore.isAuthenticated) return router.push({ name: 'Auth', query: { redirect: '/assinatura' } })
  try {
    status.value = 'Abrindo checkout seguro da assinatura...'
    const response = await subscriptionService.checkout(planId)
    if (response.data.checkoutUrl) window.location.href = response.data.checkoutUrl
  } catch (error: any) {
    status.value = error.response?.data?.error || 'Erro ao iniciar assinatura.'
  }
}

onMounted(loadPlans)
</script>
