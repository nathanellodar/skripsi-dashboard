<template>
  <div class="relative z-10 w-full max-w-[520px] px-8 sm:px-0">
    <!-- Glassmorphism Card -->
    <div class="glass-card rounded-xl p-10 md:p-16 flex flex-col gap-8 items-center relative overflow-hidden shadow-2xl shadow-black/50">
      
      <!-- Subtle Top Glow - Warning Color -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>

      <!-- Animated Shield Icon -->
      <div class="relative">
        <!-- Pulsing ring -->
        <div class="absolute inset-0 rounded-full bg-amber-500/20 animate-ping-slow"></div>
        <div class="relative w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-900/20">
          <span class="material-symbols-outlined text-5xl text-amber-400" style="font-variation-settings: 'FILL' 1;">wifi_off</span>
        </div>
      </div>

      <!-- Title -->
      <div class="flex flex-col items-center gap-3 text-center">
        <h1 class="font-headline-xl text-[32px] md:text-[36px] leading-tight font-bold text-on-surface tracking-tight">
          Jaringan Tidak Terdeteksi
        </h1>
        <p class="font-body-md text-base text-on-surface-variant max-w-[380px] leading-relaxed">
          Dashboard ini hanya dapat diakses melalui <span class="text-amber-400 font-semibold">jaringan lab</span> atau dengan mengaktifkan <span class="text-amber-400 font-semibold">VPN</span>.
        </p>
      </div>

      <!-- Divider -->
      <div class="w-full h-px bg-gradient-to-r from-transparent via-outline-variant to-transparent"></div>

      <!-- Steps -->
      <div class="w-full flex flex-col gap-4">
        <p class="font-code-log text-xs text-on-surface-variant uppercase tracking-wider font-medium">Langkah yang perlu dilakukan</p>
        
        <!-- Step 1 -->
        <div class="flex items-start gap-4 p-4 rounded-lg bg-surface-dim/60 border border-outline-variant/50 group hover:border-amber-500/30 transition-all duration-300">
          <div class="flex-shrink-0 w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <span class="font-headline-lg text-sm font-bold text-amber-400">1</span>
          </div>
          <div class="flex flex-col gap-1">
            <p class="font-body-md text-sm font-semibold text-on-surface">Hubungkan ke Jaringan Lab</p>
            <p class="font-body-sm text-xs text-on-surface-variant leading-relaxed">Pastikan perangkat Anda terhubung ke jaringan lokal laboratorium.</p>
          </div>
        </div>

        <!-- OR Divider -->
        <div class="flex items-center gap-3 px-4">
          <div class="flex-1 h-px bg-outline-variant/50"></div>
          <span class="font-code-log text-xs text-on-surface-variant font-medium tracking-wider">ATAU</span>
          <div class="flex-1 h-px bg-outline-variant/50"></div>
        </div>

        <!-- Step 2 -->
        <div class="flex items-start gap-4 p-4 rounded-lg bg-surface-dim/60 border border-outline-variant/50 group hover:border-amber-500/30 transition-all duration-300">
          <div class="flex-shrink-0 w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <span class="font-headline-lg text-sm font-bold text-amber-400">2</span>
          </div>
          <div class="flex flex-col gap-1">
            <p class="font-body-md text-sm font-semibold text-on-surface">Aktifkan VPN</p>
            <p class="font-body-sm text-xs text-on-surface-variant leading-relaxed">Nyalakan VPN yang sudah dikonfigurasi untuk mengakses jaringan lab dari luar.</p>
          </div>
        </div>
      </div>

      <!-- Retry Button -->
      <div class="w-full pt-2">
        <button 
          @click="handleRetry"
          class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 px-6 rounded-xl font-headline-lg text-base font-bold hover:from-amber-500 hover:to-orange-500 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(245,158,11,0.3)] disabled:opacity-50"
          :disabled="isRetrying"
        >
          <svg v-if="isRetrying" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-if="!isRetrying" class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">refresh</span>
          <span>{{ isRetrying ? 'Memeriksa koneksi...' : 'Coba Lagi' }}</span>
        </button>
      </div>

      <!-- Footer Hint -->
      <div class="w-full text-center">
        <p class="font-body-sm text-xs text-on-surface-variant/60 flex items-center justify-center gap-1.5">
          <span class="material-symbols-outlined text-[14px]">info</span>
          Hubungi administrator jika masalah berlanjut
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isRetrying = ref(false);

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const handleRetry = async () => {
  isRetrying.value = true;
  try {
    const res = await fetch(`${API_BASE}/users/check-setup`, { 
      signal: AbortSignal.timeout(5000) 
    });
    if (res.ok) {
      // Server reachable, redirect to login
      router.push('/login');
    }
  } catch (e) {
    // Still unreachable, stay on page
  } finally {
    isRetrying.value = false;
  }
};
</script>

<style scoped>
@keyframes ping-slow {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  75%, 100% {
    transform: scale(1.6);
    opacity: 0;
  }
}
.animate-ping-slow {
  animation: ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>
