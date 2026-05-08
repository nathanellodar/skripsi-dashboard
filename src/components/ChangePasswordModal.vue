<template>
  <transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-[#060e20]/80 backdrop-blur-sm transition-opacity" 
        @click="$emit('close')"
        aria-hidden="true"
      ></div>

      <!-- Modal Content -->
      <div 
        class="bg-[#171f33] w-[92%] max-w-[500px] rounded-2xl border border-white/10 shadow-2xl relative z-10 transform transition-all flex flex-col max-h-[90vh]"
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title"
      >
        
        <!-- Header -->
        <div class="flex justify-between items-center p-4 border-b border-white/5">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[var(--color-primary-container)]">lock</span>
            <h2 class="text-stone-100 font-manrope font-bold text-lg" id="modal-title">Change Password</h2>
          </div>
          <button 
            @click="$emit('close')" 
            class="text-stone-500 hover:text-stone-300 transition-colors p-1 rounded-full hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-container)]"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 overflow-y-auto font-inter text-sm flex-1 custom-scrollbar flex flex-col gap-4">
          
          <div class="flex flex-col gap-1.5">
            <label class="text-stone-300 font-medium text-xs uppercase tracking-wider">Old Password</label>
            <input 
              type="password" 
              v-model="form.oldPassword"
              class="w-full bg-[#0B1120] border border-white/10 rounded-lg px-4 py-2.5 text-stone-200 focus:outline-none focus:border-[var(--color-primary-container)] focus:ring-1 focus:ring-[var(--color-primary-container)] transition-all"
              placeholder="Enter your current password"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-stone-300 font-medium text-xs uppercase tracking-wider">New Password</label>
            <input 
              type="password" 
              v-model="form.newPassword"
              class="w-full bg-[#0B1120] border border-white/10 rounded-lg px-4 py-2.5 text-stone-200 focus:outline-none focus:border-[var(--color-primary-container)] focus:ring-1 focus:ring-[var(--color-primary-container)] transition-all"
              placeholder="Enter new password"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-stone-300 font-medium text-xs uppercase tracking-wider">Confirm New Password</label>
            <input 
              type="password" 
              v-model="form.confirmPassword"
              class="w-full bg-[#0B1120] border border-white/10 rounded-lg px-4 py-2.5 text-stone-200 focus:outline-none focus:border-[var(--color-primary-container)] focus:ring-1 focus:ring-[var(--color-primary-container)] transition-all"
              placeholder="Confirm new password"
            />
          </div>

        </div>

        <!-- Footer / Actions -->
        <div class="p-4 border-t border-white/5 bg-[#1A222D] sm:rounded-b-2xl flex gap-3">
          <button 
            @click="$emit('close')"
            class="flex-1 bg-white/5 hover:bg-white/10 text-stone-300 font-semibold py-2.5 rounded-lg transition-colors focus:outline-none"
          >
            Cancel
          </button>
          <button 
            @click="handleChangePassword"
            class="flex-1 bg-[var(--color-primary-container)] hover:bg-[var(--color-primary)] text-[#3a2e21] font-semibold py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1A222D] focus:ring-[var(--color-primary-container)]"
          >
            Change
          </button>
        </div>
        
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits, reactive } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close']);

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const handleChangePassword = () => {
  // Integrate API later
  console.log('Change Password Triggered:', form);
  
  // reset and close
  form.oldPassword = '';
  form.newPassword = '';
  form.confirmPassword = '';
  emit('close');
};
</script>

<style scoped>
/* Mobile bottom-up & Desktop fade-in animation */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from .bg-\[\#060e20\]\/80,
.modal-leave-to .bg-\[\#060e20\]\/80 {
  opacity: 0;
}

.modal-enter-from > div:last-child {
  opacity: 0;
  transform: translateY(100%);
}
@media (min-width: 640px) {
  .modal-enter-from > div:last-child {
    transform: scale(0.95);
  }
}

.modal-leave-to > div:last-child {
  opacity: 0;
  transform: translateY(100%);
}
@media (min-width: 640px) {
  .modal-leave-to > div:last-child {
    transform: scale(0.95);
  }
}

/* Custom minimal scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
