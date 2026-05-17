<template>
  <section class="view content-view is-active">
    <div class="section-heading"><p class="eyebrow">Atividades</p><h2>Experiências e encontros</h2><p>Oficinas, degustações e encontros para conhecer ingredientes de perto.</p></div>

    <div class="activity-layout">
      <div class="activity-list">
        <article v-for="activity in activities" :key="activity.id" class="activity-card">
          <header><div><h3>{{ activity.title }}</h3><p>{{ activity.duration }}</p></div><strong>{{ formatPrice(activity.price) }}</strong></header>
          <div class="rating-summary"><span>{{ stars(activity.averageRating || 0) }}</span><small>{{ Number(activity.averageRating || 0).toFixed(1) }} · {{ activity.reviewCount || 0 }} avaliações</small></div>
          <p>{{ activity.description }}</p>
          <div class="activity-slots"><span v-for="slot in activity.slots" :key="slot.id">{{ formatDate(slot.dateTime) }}</span></div>

          <details class="activity-reviews" @toggle="loadActivityDetails(activity)">
            <summary>Avaliar e ver comentários</summary>
            <form class="review-form" @submit.prevent="submitReview(activity.id)">
              <label>Nota<select v-model.number="reviewForms[activity.id].rating"><option v-for="n in 5" :key="n" :value="n">{{ n }} estrela{{ n > 1 ? 's' : '' }}</option></select></label>
              <label>Comentário<textarea v-model="reviewForms[activity.id].comment" rows="3" placeholder="Conte sua experiência"></textarea></label>
              <button class="button secondary compact" type="submit">Enviar avaliação</button>
            </form>
            <p class="form-status">{{ reviewStatus[activity.id] }}</p>
            <div class="review-list">
              <article v-for="review in activity.reviews" :key="review.id" class="review-card"><strong>{{ stars(review.rating) }}</strong><p>{{ review.comment || 'Sem comentário.' }}</p><small>{{ review.user?.name || 'Cliente' }}</small></article>
              <p v-if="!activity.reviews?.length" class="empty-profile">Ainda não há avaliações para esta atividade.</p>
            </div>
          </details>
        </article>
      </div>

      <form class="booking-panel" @submit.prevent="handleSubmit">
        <h3>Reservar vaga</h3>
        <label>Atividade<select v-model="formData.activity" required><option v-for="activity in activities" :key="activity.id" :value="activity.id">{{ activity.title }}</option></select></label>
        <label>Data e horário<select v-model="formData.slot" required><option v-for="slot in currentActivitySlots" :key="slot.id" :value="slot.id">{{ formatDate(slot.dateTime) }} - {{ availablePlaces(slot) }} vagas</option></select></label>
        <label>Nome<input v-model="formData.name" type="text" autocomplete="name" required /></label>
        <label>Email<input v-model="formData.email" type="email" autocomplete="email" required /></label>
        <button class="button primary" type="submit">Solicitar reserva</button>
        <p class="form-status" role="status">{{ formStatus }}</p>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { activityService, reviewService } from '../services/api'
import { useAuthStore } from '../stores/auth'

const router = useRouter(); const authStore = useAuthStore(); const activities = ref<any[]>([]); const loading = ref(false); const error = ref<string | null>(null)
const formData = ref({ activity: '', slot: '', name: '', email: '' }); const formStatus = ref(''); const reviewStatus = ref<Record<string, string>>({}); const reviewForms = ref<Record<string, { rating: number; comment: string }>>({})
const currentActivitySlots = computed(() => activities.value.find((a) => a.id === formData.value.activity)?.slots || [])
watch(() => formData.value.activity, () => { formData.value.slot = currentActivitySlots.value[0]?.id || '' })
const formatPrice = (price: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(price)
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
const availablePlaces = (slot: any) => Math.max(0, Number(slot.capacity || 0) - Number(slot.booked || 0))
const stars = (rating: number) => '★'.repeat(Math.round(rating || 0)).padEnd(5, '☆')
const ensureReviewForm = (id: string) => { if (!reviewForms.value[id]) reviewForms.value[id] = { rating: 5, comment: '' } }

const handleSubmit = async () => {
  if (!authStore.isAuthenticated) { formStatus.value = 'Faça login para reservar uma atividade.'; return }
  const activity = activities.value.find((a) => a.id === formData.value.activity); const slot = currentActivitySlots.value.find((s: any) => s.id === formData.value.slot)
  try { await activityService.book(formData.value.activity, formData.value.slot); formStatus.value = `Reserva confirmada: ${activity?.title}, ${slot ? formatDate(slot.dateTime) : ''}.`; await loadActivities() } catch (error: any) { formStatus.value = error.response?.data?.error || 'Erro ao solicitar reserva.' }
  setTimeout(() => { formStatus.value = '' }, 3000)
}
const loadActivityDetails = async (activity: any) => { ensureReviewForm(activity.id); if (activity.reviews) return; const response = await activityService.getById(activity.id); Object.assign(activity, response.data) }
const submitReview = async (activityId: string) => {
  if (!authStore.isAuthenticated) return router.push({ name: 'Auth', query: { redirect: '/atividades' } })
  ensureReviewForm(activityId)
  try { await reviewService.activity(activityId, reviewForms.value[activityId].rating, reviewForms.value[activityId].comment); reviewStatus.value[activityId] = 'Avaliação enviada com carinho.'; reviewForms.value[activityId].comment = ''; const response = await activityService.getById(activityId); const index = activities.value.findIndex((a) => a.id === activityId); if (index >= 0) activities.value[index] = response.data } catch (error: any) { reviewStatus.value[activityId] = error.response?.data?.error || 'Erro ao enviar avaliação.' }
}
const loadActivities = async () => { loading.value = true; error.value = null; try { const response = await activityService.getAll(); activities.value = response.data; activities.value.forEach((activity) => ensureReviewForm(activity.id)); if (activities.value.length > 0) { formData.value.activity = activities.value[0].id; formData.value.slot = activities.value[0].slots?.[0]?.id || '' } } catch { error.value = 'Erro ao carregar atividades' } finally { loading.value = false } }
onMounted(loadActivities)
</script>

<style scoped>
.rating-summary { color: var(--caramel); display: flex; gap: 10px; margin: 8px 0 12px; }
.rating-summary small { color: var(--muted); }
.activity-reviews { margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--line); }
.activity-reviews summary { cursor: pointer; color: var(--forest); font-weight: 800; }
.review-form { display: grid; gap: 12px; margin-top: 16px; }
.review-form label { display: grid; gap: 7px; font-weight: 700; color: var(--forest-2); }
.review-form select,.review-form textarea { border: 1px solid var(--line); border-radius: 14px; padding: 12px 14px; font: inherit; }
.review-list { display: grid; gap: 10px; margin-top: 12px; }
.review-card { padding: 14px; border: 1px solid var(--line); border-radius: 16px; background: var(--paper); }
.review-card strong { color: var(--caramel); }
</style>
