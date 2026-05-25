<template>
  <div class="relative z-10 w-full max-w-[440px] px-8 sm:px-0">
    <!-- Glassmorphism Card -->
    <div class="glass-card rounded-xl p-8 md:p-16 flex flex-col gap-10 items-center relative overflow-hidden shadow-2xl shadow-black/50">
      
      <!-- Subtle Top Glow -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-primary-container)] to-transparent opacity-30"></div>
      
      <!-- Header / Branding -->
      <div class="flex flex-col items-center gap-3 w-full text-center">
        <div class="w-16 h-16 rounded-xl bg-surface-container-high border border-outline-variant flex items-center justify-center shadow-lg shadow-black/30 mb-2">
          <span class="material-symbols-outlined text-4xl text-[var(--color-primary)]" style="font-variation-settings: 'FILL' 1;">admin_panel_settings</span>
        </div>
        <h1 class="font-headline-xl text-[36px] leading-tight font-bold text-on-surface tracking-tight">System Setup</h1>
        <p class="font-body-sm text-sm text-on-surface-variant">Initialize Root Operator</p>
      </div>

      <!-- Setup Form -->
      <form @submit.prevent="handleSetup" class="w-full flex flex-col gap-6">
        
        <div v-if="error" class="p-3 rounded bg-error/20 text-error text-sm border border-error/30 transition-elegant">
          {{ error }}
        </div>

        <!-- Username Field -->
        <div class="flex flex-col gap-2">
          <label class="font-code-log text-xs text-on-surface-variant uppercase tracking-wider font-medium" for="username">Operator ID</label>
          <div class="relative group">
            <span class="material-symbols-outlined text-[20px] absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-[var(--color-primary)] transition-colors">badge</span>
            <input 
              class="w-full bg-surface-dim border border-outline-variant rounded-lg py-3 pl-[40px] pr-3 font-body-md text-base text-on-surface placeholder:text-outline focus:border-[var(--color-primary-container)] focus:ring-1 focus:ring-[var(--color-primary-container)] transition-all outline-none shadow-inner" 
              id="username" 
              name="username" 
              v-model="form.username"
              placeholder="e.g. admin" 
              type="text"
              required
            />
          </div>
        </div>

        <!-- Password Field -->
        <div class="flex flex-col gap-2">
          <label class="font-code-log text-xs text-on-surface-variant uppercase tracking-wider font-medium" for="password">Passphrase</label>
          <div class="relative group">
            <span class="material-symbols-outlined text-[20px] absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-[var(--color-primary)] transition-colors">key</span>
            <input 
              class="w-full bg-surface-dim border border-outline-variant rounded-lg py-3 pl-[40px] pr-3 font-body-md text-base text-on-surface placeholder:text-outline focus:border-[var(--color-primary-container)] focus:ring-1 focus:ring-[var(--color-primary-container)] transition-all outline-none shadow-inner" 
              id="password" 
              name="password" 
              v-model="form.password"
              placeholder="••••••••" 
              type="password"
              required
            />
          </div>
        </div>

        <!-- Confirm Password Field -->
        <div class="flex flex-col gap-2">
          <label class="font-code-log text-xs text-on-surface-variant uppercase tracking-wider font-medium" for="confirm_password">Confirm Passphrase</label>
          <div class="relative group">
            <span class="material-symbols-outlined text-[20px] absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-[var(--color-primary)] transition-colors">password</span>
            <input 
              class="w-full bg-surface-dim border border-outline-variant rounded-lg py-3 pl-[40px] pr-3 font-body-md text-base text-on-surface placeholder:text-outline focus:border-[var(--color-primary-container)] focus:ring-1 focus:ring-[var(--color-primary-container)] transition-all outline-none shadow-inner" 
              id="confirm_password" 
              name="confirm_password" 
              v-model="form.confirmPassword"
              placeholder="••••••••" 
              type="password"
              required
            />
          </div>
        </div>

        <!-- Action Button -->
        <div class="pt-4">
          <button 
            class="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-headline-lg text-lg font-bold hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(79,70,229,0.4)] disabled:opacity-50" 
            type="submit"
            :disabled="isLoading"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="!isLoading" class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">person_add</span>
            <span>{{ isLoading ? 'Initializing...' : 'Complete Setup' }}</span>
          </button>
        </div>
      </form>

      <!-- Footer info -->
      <div class="mt-auto pt-6 w-full border-t border-outline-variant/30 text-center">
        <p class="font-body-sm text-sm text-on-surface-variant flex items-center justify-center gap-2">
          <span class="material-symbols-outlined text-[16px] text-[var(--color-tertiary-container)]">info</span>
          First-time initialization required
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { setupUser, login } from '../api/gateway';

const router = useRouter();
const isLoading = ref(false);
const error = ref('');

const form = ref({
  username: '',
  password: '',
  confirmPassword: ''
});

const handleSetup = async () => {
  error.value = '';

  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match.';
    return;
  }

  isLoading.value = true;
  
  try {
    // 1. Setup User
    await setupUser(form.value.username, form.value.password);
    
    // 2. Automatically login the user right after setup
    await login(form.value.username, form.value.password);
    
    // 3. Redirect to Dashboard
    router.push('/dashboard');
  } catch (err) {
    error.value = err.message || 'Failed to initialize setup';
  } finally {
    isLoading.value = false;
  }
};
</script>
