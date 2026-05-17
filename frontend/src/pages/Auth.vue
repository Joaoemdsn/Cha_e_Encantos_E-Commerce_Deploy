<template>
  <section class="view content-view is-active auth-view">
    <div class="section-heading">
      <p class="eyebrow">Conta</p>
      <h2>{{ heading }}</h2>
      <p>Entre para finalizar pedidos, reservar atividades e acompanhar suas caixinhas.</p>
    </div>

    <form class="auth-card" @submit.prevent="handleSubmit">
      <div class="auth-tabs" role="tablist" aria-label="Tipo de acesso">
        <button type="button" :class="{ 'is-active': mode === 'login' }" @click="setMode('login')">Login</button>
        <button type="button" :class="{ 'is-active': mode === 'register' }" @click="setMode('register')">Cadastro</button>
      </div>

      <template v-if="mode === 'forgot'">
        <label>Email cadastrado<input v-model="form.email" type="email" autocomplete="email" required /></label>
        <button class="button primary full" type="submit">Enviar link de recuperação</button>
      </template>

      <template v-else-if="mode === 'reset'">
        <label>Email<input v-model="form.email" type="email" autocomplete="email" required /></label>
        <label>Token<input v-model="resetToken" type="text" required /></label>
        <label>Nova senha<input v-model="form.password" type="password" autocomplete="new-password" required minlength="6" /></label>
        <button class="button primary full" type="submit">Redefinir senha</button>
      </template>

      <template v-else>
        <label v-if="mode === 'register'">Nome<input v-model="form.name" type="text" autocomplete="name" :required="mode === 'register'" /></label>
        <label>Email<input v-model="form.email" type="email" autocomplete="email" required /></label>
        <label>Senha<input v-model="form.password" type="password" autocomplete="current-password" required minlength="6" /></label>
        <button class="button primary full" type="submit" :disabled="authStore.loading">
          {{ authStore.loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta' }}
        </button>
        <button class="text-button" type="button" @click="setMode('forgot')">Esqueceu a senha?</button>
      </template>

      <button v-if="mode === 'forgot' || mode === 'reset'" class="text-button" type="button" @click="setMode('login')">Voltar para login</button>
      <p class="form-status" role="status">{{ statusMessage }}</p>
      <a v-if="devResetUrl" class="dev-reset-link" :href="devResetUrl">Abrir link de recuperação local</a>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { authService } from '../services/api'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const mode = ref<'login' | 'register' | 'forgot' | 'reset'>('login')
const form = ref({ name: '', email: '', password: '' })
const resetToken = ref('')
const localMessage = ref('')
const devResetUrl = ref('')

const heading = computed(() => ({ login: 'Entrar', register: 'Criar conta', forgot: 'Recuperar senha', reset: 'Nova senha' }[mode.value]))
const statusMessage = computed(() => authStore.error || localMessage.value)

const setMode = (nextMode: typeof mode.value) => {
  mode.value = nextMode
  localMessage.value = ''
  devResetUrl.value = ''
}

const handleSubmit = async () => {
  localMessage.value = ''
  devResetUrl.value = ''
  try {
    if (mode.value === 'login') {
      await authStore.login(form.value.email, form.value.password)
      router.push((route.query.redirect as string) || '/perfil')
      return
    }
    if (mode.value === 'register') {
      await authStore.register(form.value.email, form.value.password, form.value.name)
      router.push((route.query.redirect as string) || '/perfil')
      return
    }
    if (mode.value === 'forgot') {
      const response = await authService.forgotPassword(form.value.email)
      localMessage.value = response.data.message || 'Verifique seu email.'
      devResetUrl.value = response.data.devResetUrl || ''
      return
    }
    await authService.resetPassword(form.value.email, resetToken.value, form.value.password)
    localMessage.value = 'Senha alterada com sucesso. Faça login com a nova senha.'
    mode.value = 'login'
    form.value.password = ''
  } catch (error: any) {
    localMessage.value = error.response?.data?.error || 'Não foi possível concluir a solicitação.'
  }
}

onMounted(() => {
  if (route.query.resetToken) {
    resetToken.value = String(route.query.resetToken)
    form.value.email = String(route.query.email || '')
    mode.value = 'reset'
  }
})
</script>

<style scoped>
.auth-view { min-height: 60vh; }
.auth-card { width: min(100% - 48px, 460px); margin: 0 auto clamp(48px, 8vw, 96px); padding: 28px; border-radius: 24px; background: white; box-shadow: 0 18px 50px rgba(29, 48, 40, 0.08); display: grid; gap: 18px; }
.auth-card label { display: grid; gap: 8px; color: var(--forest-2); font-weight: 600; }
.auth-card input { width: 100%; border: 1px solid rgba(29, 48, 40, 0.18); border-radius: 14px; padding: 14px 16px; font: inherit; }
.auth-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 6px; border-radius: 999px; background: var(--paper-2); }
.auth-tabs button { border: 0; border-radius: 999px; padding: 10px 14px; background: transparent; color: var(--forest-2); font-weight: 700; cursor: pointer; }
.auth-tabs button.is-active { background: white; }
.text-button { border: 0; background: transparent; color: var(--forest-2); font-weight: 700; cursor: pointer; text-decoration: underline; justify-self: center; }
.dev-reset-link { display: block; padding: 12px; border-radius: 14px; background: var(--paper-2); color: var(--forest); font-weight: 700; text-align: center; }
</style>
