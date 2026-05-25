<template>
  <div class="bg-background text-on-background font-body-md min-h-screen pb-20 md:pb-0 overflow-x-hidden flex flex-col md:flex-row">
    
    <!-- Top Navigation Area (Mobile Header) -->
    <header class="bg-[#1A222D] text-stone-200 font-manrope antialiased tracking-tight full-width top-0 border-b border-white/5 flex justify-between items-center w-full px-4 py-3 sticky z-40 md:hidden">
      <div class="flex items-center gap-3">
        <!-- <button aria-label="Open Menu" class="p-1 text-stone-400 hover:text-stone-200 transition-all duration-200">
          <span class="material-symbols-outlined text-[28px]">menu</span>
        </button> -->
        <span class="text-base font-bold tracking-wider text-stone-100 uppercase leading-tight">MONITORING<br/>GATEWAY</span>
      </div>
      <div class="flex gap-2 items-center">
        <button class="p-2 text-stone-400 hover:text-stone-200 transition-all duration-200">
          <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">notifications_active</span>
        </button>
        <button class="w-8 h-8 rounded border border-white/20 overflow-hidden">
          <img alt="Analyst profile" class="w-full h-full object-cover" src="https://ui-avatars.com/api/?name=Admin+Security&background=10b981&color=fff"/>
        </button>
      </div>
    </header>

    <!-- SideNavBar (Desktop) -->
    <aside class="fixed inset-y-0 left-0 w-64 border-r bg-[#0B1120]/95 backdrop-blur-2xl text-slate-300 font-manrope text-sm font-medium border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] flex-col h-full z-[100] transform -translate-x-full md:translate-x-0 transition-transform duration-300 hidden md:flex">
      <div class="p-6 border-b border-white/5 flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <img alt="Security Analyst Avatar" class="w-10 h-10 rounded-full border-2 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]" src="https://ui-avatars.com/api/?name=Admin+Security&background=3B82F6&color=fff"/>
          <div>
            <h2 class="text-white font-black tracking-tighter">Monitoring Gateway</h2>
            <p class="text-blue-400 text-xs">Vigilant System Status: Online</p>
          </div>
        </div>
      </div>
      
      <nav class="flex-1 py-4 flex flex-col gap-2 px-3">
        <router-link to="/dashboard" class="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)] touch-manipulation transition-elegant font-bold">
          <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">dashboard</span>
          Dashboard
        </router-link>
        <a @click.prevent="isPasswordModalOpen = true" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all touch-manipulation transition-elegant cursor-pointer" href="#">
          <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">lock</span>
          Change Password
        </a>
      </nav>

      <div class="p-4 border-t border-white/5">
        <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all touch-manipulation transition-elegant">
          <span class="material-symbols-outlined text-[20px]">logout</span>
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content Canvas -->
    <main class="flex-1 flex flex-col p-4 md:ml-64 md:p-8 w-full relative z-10">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Mobile Bottom Navigation Tab -->
    <div class="fixed bottom-0 left-0 w-full bg-[#0B1120] border-t border-white/5 p-2 z-50 md:hidden flex justify-around items-center pb-safe shadow-[0_-5px_15px_rgba(0,0,0,0.3)]">
      <router-link to="/dashboard" class="flex flex-col items-center p-2 text-[var(--color-primary-container)] group transition-all">
        <span class="material-symbols-outlined group-hover:-translate-y-1 transition-transform" style="font-variation-settings: 'FILL' 1;">dashboard</span>
        <span class="text-[10px] font-bold mt-1 tracking-wider uppercase">Dash</span>
      </router-link>
      <button @click="isPasswordModalOpen = true" class="flex flex-col items-center p-2 text-slate-500 hover:text-slate-300 group transition-all">
        <span class="material-symbols-outlined group-hover:-translate-y-1 transition-transform">lock</span>
        <span class="text-[10px] font-bold mt-1 tracking-wider uppercase">Password</span>
      </button>
      <button @click="handleLogout" class="flex flex-col items-center p-2 text-slate-500 hover:text-slate-300 group transition-all">
        <span class="material-symbols-outlined group-hover:-translate-y-1 transition-transform">logout</span>
        <span class="text-[10px] font-bold mt-1 tracking-wider uppercase">Logout</span>
      </button>
    </div>

    <!-- Modals -->
    <ChangePasswordModal :isOpen="isPasswordModalOpen" @close="isPasswordModalOpen = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { logout } from '../api/gateway';
import ChangePasswordModal from '../components/ChangePasswordModal.vue';

const router = useRouter();
const isPasswordModalOpen = ref(false);

const handleLogout = async () => {
  await logout();
  router.push('/login');
};
</script>
