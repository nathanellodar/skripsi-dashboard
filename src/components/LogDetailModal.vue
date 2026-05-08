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
            <span class="material-symbols-outlined text-[var(--color-primary-container)]">receipt_long</span>
            <h2 class="text-stone-100 font-manrope font-bold text-lg" id="modal-title">Log Details</h2>
          </div>
          <button 
            @click="$emit('close')" 
            class="text-stone-500 hover:text-stone-300 transition-colors p-1 rounded-full hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-container)]"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Scrollable Content -->
        <div class="p-4 overflow-y-auto font-inter text-sm flex-1 custom-scrollbar">
          
          <div v-if="log" class="flex flex-col gap-4">
            <!-- Metadata Area -->
            <div class="bg-black/20 rounded-lg p-3 border border-white/5">
              <div class="text-[10px] text-stone-500 uppercase tracking-widest mb-1">Event ID</div>
              <div class="font-mono text-stone-300 text-xs break-all">{{ log.id || 'EVT-0000000000' }}</div>
            </div>

            <!-- Details List -->
            <div class="flex flex-col border border-white/5 rounded-lg overflow-hidden bg-[#131b2e]">
              
              <div class="flex justify-between p-3 border-b border-white/5 items-center">
                <span class="text-stone-400">Attack Type</span>
                <span class="text-stone-200 font-medium">{{ log.description || 'Unknown' }}</span>
              </div>
              
              <div class="flex justify-between p-3 border-b border-white/5 items-center">
                <span class="text-stone-400">Time</span>
                <span class="text-stone-200 font-mono text-xs">{{ log.timestamp ? new Date(log.timestamp).toLocaleString() : '-' }}</span>
              </div>
              
              <div class="flex justify-between p-3 border-b border-white/5 items-center">
                <span class="text-stone-400">Source IP</span>
                <span class="text-stone-200 font-mono text-xs bg-white/5 px-2 py-0.5 rounded">{{ log.sourceIp || '-' }}</span>
              </div>
              
              <div class="flex justify-between p-3 border-b border-white/5 items-center">
                <span class="text-stone-400">To Port</span>
                <span class="text-[var(--color-primary-container)] font-mono font-bold">{{ log.port || '-' }}</span>
              </div>
              
              <div class="flex justify-between p-3 items-center">
                <span class="text-stone-400">Action</span>
                <span 
                  class="px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase"
                  :class="{
                    'bg-[var(--color-error)]/20 text-[var(--color-error)] border border-[var(--color-error)]/30': log.action === 'BLOCKED',
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30': log.action !== 'BLOCKED'
                  }"
                >
                  {{ log.action || 'UNKNOWN' }}
                </span>
              </div>

            </div>
          </div>
          
          <div v-else class="py-10 text-center text-stone-500 flex flex-col items-center gap-2">
            <span class="material-symbols-outlined text-4xl opacity-50">hourglass_empty</span>
            <p>Loading details...</p>
          </div>

        </div>

        <!-- Footer / Actions -->
        <div class="p-4 border-t border-white/5 bg-[#1A222D] sm:rounded-b-2xl">
          <button 
            @click="$emit('close')"
            class="w-full bg-[var(--color-primary-container)] hover:bg-[var(--color-primary)] text-[#3a2e21] font-semibold py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1A222D] focus:ring-[var(--color-primary-container)]"
          >
            Acknowledge & Close
          </button>
        </div>
        
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  log: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);
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
