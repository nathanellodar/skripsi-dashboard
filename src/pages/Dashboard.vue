<template>
  <div class="flex flex-col h-auto md:h-[calc(100vh-64px)] overflow-visible md:overflow-hidden">
    <header class="mb-3 md:mb-4 shrink-0">
      <h1 class="font-headline-xl text-[24px] md:text-[40px] leading-none mb-1 md:mb-2 text-on-surface tracking-tight">Dashboard</h1>
      <p class="text-body-md font-body-md text-on-surface-variant text-sm md:text-base">Real-time system health and security overview.</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 flex-1 min-h-0">
      
      <!-- Left Column: Gateway Details & Ports -->
      <div class="lg:col-span-3 flex flex-col gap-3 md:gap-4 overflow-visible md:overflow-y-auto custom-scrollbar min-h-0 md:max-h-full">
        
        <!-- Gateway Details -->
        <div class="glass-card rounded-xl md:rounded-2xl p-4 md:p-6 relative overflow-hidden group">
          <!-- Subtle Glow -->
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-[var(--color-primary-container)]/10 rounded-full blur-2xl group-hover:bg-[var(--color-primary-container)]/20 transition-all duration-500"></div>
          
          <h2 class="font-headline-lg text-[16px] md:text-[18px] text-on-surface mb-3 md:mb-4 border-b border-white/5 pb-2 md:pb-3">Gateway Details</h2>
          <div v-if="device" class="flex flex-col gap-3 md:gap-4">
            <div class="flex justify-between items-center">
              <span class="font-body-sm text-sm text-on-surface-variant">Brand</span>
              <span class="font-body-sm text-sm text-on-surface font-medium">{{ device.brand }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-body-sm text-sm text-on-surface-variant">Model</span>
              <span class="font-body-sm text-sm text-on-surface font-medium">{{ device.model }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-body-sm text-sm text-on-surface-variant">Identity</span>
              <span class="font-code-log text-xs text-[var(--color-primary-container)] bg-surface-container px-2 py-1 rounded shadow-inner">{{ device.identity }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-body-sm text-sm text-on-surface-variant">Public IP</span>
              <span class="font-code-log text-xs text-on-surface bg-surface-container px-2 py-1 rounded shadow-inner">{{ device.public_ip }}</span>
            </div>
            <div class="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <div class="flex items-center gap-2 text-sm text-on-surface-variant">
                <span class="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span>
                <span>Online</span>
              </div>
              <div class="flex items-center gap-1 text-sm text-[var(--color-primary)]">
                <span class="material-symbols-outlined text-[16px]">update</span>
                <span v-if="device.updated_at">{{ new Date(device.updated_at).toLocaleTimeString() }}</span>
              </div>
            </div>
          </div>
          <div v-else class="text-on-surface-variant text-sm py-4 text-center">
            No device information available.
          </div>
        </div>

        <!-- Port Management -->
        <div class="glass-card rounded-xl md:rounded-2xl p-4 md:p-6">
          <div class="flex justify-between items-center mb-3 md:mb-4 border-b border-white/5 pb-2 md:pb-3">
            <h2 class="font-headline-lg text-[16px] md:text-[18px] text-on-surface">Port Status</h2>
            <div class="flex items-center gap-1.5 md:gap-2">
              <span class="text-[10px] md:text-xs text-on-surface-variant font-mono">{{ displayPorts.length }} services</span>
              <button 
                @click="handleSyncPorts"
                :disabled="isSyncing"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 border"
                :class="isSyncing 
                  ? 'bg-[var(--color-primary-container)]/20 border-[var(--color-primary-container)]/40 text-[var(--color-primary-container)] cursor-wait' 
                  : 'bg-[var(--color-primary-container)]/10 border-[var(--color-primary-container)]/30 text-[var(--color-primary)] hover:bg-[var(--color-primary-container)]/25 hover:border-[var(--color-primary-container)]/50 hover:shadow-[0_0_12px_rgba(59,130,246,0.2)] active:scale-95'"
                title="Sync service ports dari router MikroTik ke database"
              >
                <span class="material-symbols-outlined text-[14px]" :class="{ 'animate-spin': isSyncing }">sync</span>
                <span>{{ isSyncing ? 'Syncing...' : 'Sync Ports' }}</span>
              </button>
            </div>
          </div>
          <div class="overflow-y-auto max-h-[280px] md:max-h-[420px] pr-1 custom-scrollbar">
            <div class="grid grid-cols-3 gap-1.5 md:gap-2">
              <div v-for="port in displayPorts" :key="port.port" 
                   @click="togglePortStatus(port)"
                   class="border rounded-lg md:rounded-xl flex flex-col items-center py-2 md:py-2.5 relative overflow-hidden group cursor-pointer transition-elegant"
                   :class="{
                     'bg-[var(--color-primary-container)]/10 border-[var(--color-primary-container)]/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]': port.status === 'on',
                     'bg-surface-container border-white/5 shadow-inner hover:border-[var(--color-primary-container)]/50': port.status === 'off'
                   }">
                <span class="font-code-log text-xs md:text-sm font-semibold"
                      :class="port.status === 'on' ? 'text-[var(--color-primary)]' : 'text-on-surface'">
                  {{ port.port }}
                </span>
                <span class="text-[9px] uppercase font-bold mt-0.5 text-center leading-tight px-1 truncate w-full"
                      :class="port.status === 'on' ? 'text-[var(--color-primary)]/80' : 'text-on-surface-variant'">
                  {{ port.service }}
                </span>
                
                <div v-if="port.status === 'on'" class="mt-1.5 w-full px-2 flex flex-col gap-1 text-on-surface">
                  <div class="flex justify-between items-center bg-black/20 px-1.5 py-0.5 rounded border border-white/5" title="Total Serangan">
                    <span class="material-symbols-outlined text-[11px] text-[var(--color-error)]">warning</span>
                    <span class="font-mono text-[9px]">{{ port.attacks || 0 }}</span>
                  </div>
                </div>
                <div v-else class="mt-1.5 text-[9px] text-[var(--color-error)] font-bold">
                  FILTERED
                </div>
                
                <span class="absolute bottom-0 w-full h-0.5 opacity-80"
                      :class="port.status === 'on' ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,1)]' : 'bg-[var(--color-error)]'"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Center Column: Live Traffic Logs (Terminal Stream) -->
      <div class="lg:col-span-5 flex flex-col min-h-[300px] md:min-h-0">
        <div class="glass-card rounded-xl md:rounded-2xl p-0 flex flex-col flex-1 overflow-hidden border border-white/5 relative shadow-2xl min-h-0">
          <!-- Top Border Accent -->
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-primary-container)] to-[var(--color-tertiary)]"></div>
          
          <div class="p-3 md:p-5 border-b border-white/5 bg-surface/30 flex justify-between items-center backdrop-blur-md">
            <div class="flex items-center gap-2 md:gap-3">
              <div class="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-[var(--color-primary-container)]/20 flex items-center justify-center text-[var(--color-primary-container)]">
                <span class="material-symbols-outlined text-[16px] md:text-[18px]">terminal</span>
              </div>
              <h2 class="font-headline-lg text-[15px] md:text-[18px] text-on-surface flex items-center gap-2">
                Live Traffic Logs
                <span v-if="isTerminalStreaming" class="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" title="Terminal stream active"></span>
              </h2>
            </div>
          </div>
          <div class="flex-1 bg-surface-container-lowest p-2 md:p-3 overflow-y-auto font-code-log text-[10px] md:text-xs flex flex-col gap-0.5 custom-scrollbar min-h-[200px] max-h-[300px] md:max-h-none" ref="terminalContainer">
            <div v-if="terminalLogs.length === 0" class="text-on-surface-variant p-2 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[var(--color-primary-container)] animate-bounce"></span> Waiting for terminal stream...
            </div>
            <div v-else v-for="(line, idx) in terminalLogs" :key="idx" 
                 class="flex gap-2 py-1 px-2 rounded hover:bg-surface-container transition-elegant group font-mono leading-snug"
                 :class="{
                   'text-on-surface-variant': line.prefix === 'LOG',
                   'text-emerald-400': line.prefix === 'DB',
                   'text-sky-400': line.prefix === 'NOTIF',
                   'text-amber-400': line.prefix === 'MITIGASI',
                   'text-on-surface-variant': !line.prefix
                 }">
              <span class="text-outline/60 whitespace-nowrap text-[10px] shrink-0">{{ line.timestamp }}</span>
              <span v-if="line.prefix" class="font-bold shrink-0 text-[10px]"
                    :class="{
                      'text-slate-500': line.prefix === 'LOG',
                      'text-emerald-500': line.prefix === 'DB',
                      'text-sky-500': line.prefix === 'NOTIF',
                      'text-amber-500': line.prefix === 'MITIGASI'
                    }">[{{ line.prefix }}]</span>
              <span class="break-all"
                    :class="{
                      'text-slate-400': line.prefix === 'LOG',
                      'text-emerald-300': line.prefix === 'DB',
                      'text-sky-300': line.prefix === 'NOTIF',
                      'text-amber-300': line.prefix === 'MITIGASI',
                      'text-on-surface-variant': !line.prefix
                    }">{{ line.body }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Threat Distribution & Alerts -->
      <div class="lg:col-span-4 flex flex-col gap-3 md:gap-4 overflow-visible md:overflow-y-auto custom-scrollbar min-h-0 md:max-h-full">
        
        <!-- Attack Statistics -->
        <div class="glass-card rounded-xl md:rounded-2xl p-4 md:p-6">
          <h2 class="font-headline-lg text-[16px] md:text-[18px] text-on-surface mb-4 md:mb-6 border-b border-white/5 pb-2 md:pb-3">Threat Distribution</h2>
          
          <div class="flex flex-col items-center justify-center py-2">
            <!-- Modern Donut Chart representation -->
            <div class="relative w-36 h-36 md:w-48 md:h-48 mb-4 md:mb-6">
              <!-- SVG Donut Chart -->
              <svg viewBox="0 0 100 100" class="w-full h-full transform -rotate-90 drop-shadow-2xl">
                <!-- Background circle -->
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" stroke-width="12"></circle>
                
                <template v-if="stats && stats.total > 0">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-tertiary)" stroke-width="12" stroke-dasharray="251.2" :stroke-dashoffset="getDashOffset(stats.by_type?.['DDOS'])"></circle>
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-error)" stroke-width="12" stroke-dasharray="251.2" :stroke-dashoffset="getDashOffset(stats.by_type?.['PORT-SCAN'])" :class="`origin-center rotate-[${getRotation('PORT-SCAN')}deg]`"></circle>
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-primary-container)" stroke-width="12" stroke-dasharray="251.2" :stroke-dashoffset="getDashOffset(stats.by_type?.['BRUTE-FORCE'])" :class="`origin-center rotate-[${getRotation('BRUTE-FORCE')}deg]`"></circle>
                </template>
              </svg>
              
              <!-- Center Total Label -->
              <div class="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-surface-container-lowest/50 shadow-inner">
                <span class="text-[24px] md:text-[32px] font-black text-on-surface drop-shadow-lg leading-none">{{ stats?.total || '0' }}</span>
                <span class="text-[8px] md:text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Total Threats</span>
              </div>
            </div>

            <!-- Legend with Counts -->
            <div class="w-full flex justify-between gap-2 border-t border-white/5 pt-3 md:pt-5">
              <div class="flex flex-col items-center gap-1">
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-[var(--color-primary-container)] shadow-[0_0_8px_var(--color-primary-container)]"></span>
                  <span class="font-body-sm text-[11px] text-on-surface-variant uppercase tracking-wider text-center">Brute Force</span>
                </div>
                <span class="text-sm font-bold text-on-surface">{{ stats?.by_type?.['BRUTE-FORCE'] || 0 }}</span>
              </div>
              <div class="flex flex-col items-center gap-1 border-l border-r border-white/5 px-4">
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-[var(--color-error)] shadow-[0_0_8px_var(--color-error)]"></span>
                  <span class="font-body-sm text-[11px] text-on-surface-variant uppercase tracking-wider text-center">Port Scan</span>
                </div>
                <span class="text-sm font-bold text-on-surface">{{ stats?.by_type?.['PORT-SCAN'] || 0 }}</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-[var(--color-tertiary)] shadow-[0_0_8px_var(--color-tertiary)]"></span>
                  <span class="font-body-sm text-[11px] text-on-surface-variant uppercase tracking-wider text-center">DDoS</span>
                </div>
                <span class="text-sm font-bold text-on-surface">{{ stats?.by_type?.['DDOS'] || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Alerts -->
        <div class="glass-card rounded-xl md:rounded-2xl p-4 md:p-6 flex-1 flex flex-col">
          <div class="flex justify-between items-center mb-3 md:mb-4 border-b border-white/5 pb-2 md:pb-3">
            <h2 class="font-headline-lg text-[16px] md:text-[18px] text-on-surface">Alert History</h2>
          </div>
          <div class="flex flex-col gap-2 md:gap-3 overflow-y-auto custom-scrollbar max-h-[200px] md:max-h-[250px]">
            <div v-if="activeAlerts.length === 0" class="text-on-surface-variant text-sm py-2">
              No recent alerts found.
            </div>
            <div v-else v-for="(alert, idx) in activeAlerts" :key="idx"
                 @click="handleAlertClick(alert)"
                 class="border rounded-lg md:rounded-xl p-3 md:p-4 flex flex-col gap-1.5 md:gap-2 transition-elegant cursor-pointer group relative overflow-hidden bg-surface-container border-white/10 hover:bg-surface-container-highest shadow-lg">
              
              <div class="flex justify-between items-start pr-2">
                <span class="font-body-sm text-sm font-semibold transition-all text-[var(--color-error)] group-hover:drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]">
                  [{{ alert.attack_type }}]
                </span>
                <span class="font-body-sm text-[10px] text-on-surface-variant">{{ alert.timestamp }}</span>
              </div>
              <div class="text-xs text-on-surface-variant mb-1">{{ alert.alert }}</div>
              <div class="font-code-log text-xs text-on-surface-variant bg-surface-container-lowest p-2 rounded border border-white/5">
                SRC: <span class="text-on-surface">{{ alert.src_ip }}</span> | 
                PORT: <span class="text-[var(--color-primary)]">{{ alert.port }}</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>

    <!-- Modal -->
    <LogDetailModal 
      :is-open="isModalOpen" 
      :log="selectedLog" 
      @close="isModalOpen = false" 
    />

    <!-- Sync Toast Notification -->
    <Teleport to="body">
      <transition name="sync-toast">
        <div v-if="syncToast.show" 
             class="fixed z-[9999] sync-toast-container"
             role="alert">
          <div class="relative w-[360px] max-w-[calc(100vw-2rem)] rounded-xl border shadow-2xl overflow-hidden backdrop-blur-xl"
               :class="{
                 'bg-[#0d1f17]/95 border-emerald-500/30': syncToast.type === 'success',
                 'bg-[#1f0d0d]/95 border-red-500/30': syncToast.type === 'error'
               }">
            
            <!-- Top accent bar -->
            <div class="h-0.5 w-full"
                 :class="syncToast.type === 'success' ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-red-500 to-red-400'"></div>
            
            <div class="p-3.5">
              <!-- Header row: Icon + Title + Close button -->
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                     :class="syncToast.type === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'">
                  <span class="material-symbols-outlined text-[20px]" 
                        :class="syncToast.type === 'success' ? 'text-emerald-400' : 'text-red-400'">
                    {{ syncToast.type === 'success' ? 'check_circle' : 'error' }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-bold text-on-surface leading-tight">{{ syncToast.title }}</h3>
                  <p class="text-xs mt-1 leading-relaxed"
                     :class="syncToast.type === 'success' ? 'text-emerald-300/80' : 'text-red-300/80'"
                  >{{ syncToast.message }}</p>
                </div>
                <button @click="dismissSyncToast" 
                        class="shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 hover:bg-white/10 active:scale-90 mt-0.5"
                        title="Tutup">
                  <span class="material-symbols-outlined text-[16px] text-on-surface-variant hover:text-on-surface">close</span>
                </button>
              </div>

              <!-- Changes detail (if any) -->
              <div v-if="syncToast.changes && syncToast.changes.length > 0" class="mt-3 pt-3 border-t border-white/10">
                <div class="flex flex-col gap-1">
                  <div v-for="(change, idx) in syncToast.changes" :key="idx"
                       class="flex items-center gap-2 bg-white/5 rounded-lg px-2.5 py-1.5 text-[11px] font-mono border border-white/5">
                    <span class="text-on-surface-variant truncate">{{ change.service }}</span>
                    <span class="text-red-400">{{ change.old_port }}</span>
                    <span class="material-symbols-outlined text-[12px] text-on-surface-variant">arrow_forward</span>
                    <span class="text-emerald-400">{{ change.new_port }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Auto-dismiss progress bar -->
            <div class="h-0.5 w-full bg-white/5">
              <div class="h-full sync-toast-progress"
                   :class="syncToast.type === 'success' ? 'bg-emerald-400/60' : 'bg-red-400/60'"></div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import LogDetailModal from '../components/LogDetailModal.vue';
import { 
  fetchStatsSummary, 
  fetchNotifHistory, 
  fetchDevice, 
  fetchOpenPorts,
  disablePort,
  enablePort,
  syncServicePorts,
  connectLogStream,
  disconnectLogStream,
  connectTerminalStream,
  disconnectTerminalStream
} from '../api/gateway';

const stats = ref({});
const terminalLogs = ref([]);
const isTerminalStreaming = ref(false);
const terminalContainer = ref(null);
const device = ref(null);
const activeAlerts = ref([]);
const rawOpenPorts = ref([]);

const isModalOpen = ref(false);
const selectedLog = ref(null);

// Sync Services Port
const isSyncing = ref(false);
const syncToast = ref({ show: false, type: 'success', title: '', message: '', changes: [] });
let syncToastTimer = null;

const dismissSyncToast = () => {
  syncToast.value.show = false;
  if (syncToastTimer) {
    clearTimeout(syncToastTimer);
    syncToastTimer = null;
  }
};

const showSyncToast = (type, title, message, changes = []) => {
  // Clear any existing timer
  if (syncToastTimer) {
    clearTimeout(syncToastTimer);
    syncToastTimer = null;
  }
  syncToast.value = { show: true, type, title, message, changes };
  // Auto-dismiss after 3 seconds
  syncToastTimer = setTimeout(() => {
    syncToast.value.show = false;
    syncToastTimer = null;
  }, 3000);
};

const handleSyncPorts = async () => {
  if (isSyncing.value) return;
  isSyncing.value = true;
  try {
    const result = await syncServicePorts();
    const changes = result.changes || [];
    if (changes.length > 0) {
      showSyncToast('success', `Sync Berhasil — ${changes.length} Perubahan`, result.message || `${changes.length} port berubah.`, changes);
    } else {
      showSyncToast('success', 'Sync Berhasil', result.message || 'Tidak ada perubahan port.');
    }
    // Refresh port data after sync
    await loadOpenPorts();
  } catch (error) {
    showSyncToast('error', 'Sync Gagal', error.message || 'Gagal melakukan sinkronisasi port.');
  } finally {
    isSyncing.value = false;
  }
};

// De-duplicate ports from API and show all of them
const displayPorts = computed(() => {
  const portMap = new Map();
  
  for (const entry of rawOpenPorts.value) {
    const key = entry.port;
    const existing = portMap.get(key);
    
    if (!existing) {
      portMap.set(key, { ...entry });
    } else {
      // If any entry for this port is 'open', mark as open
      if (entry.state === 'open') {
        existing.state = 'open';
      }
    }
  }
  
  // Sort by port number and map to display format
  return Array.from(portMap.values())
    .sort((a, b) => a.port - b.port)
    .map(p => {
      const portStats = stats.value?.per_port?.find(sp => sp.port === p.port);
      return {
        port: p.port,
        service: p.service,
        protocol: p.protocol,
        status: p.state === 'open' ? 'on' : 'off',
        attacks: portStats ? portStats.total : 0
      };
    });
});

const getDashOffset = (val) => {
  if (!val || !stats.value.total) return 251.2;
  const percentage = val / stats.value.total;
  return 251.2 - (percentage * 251.2);
};

const getRotation = (type) => {
  if (!stats.value.total) return 0;
  let totalPercent = 0;
  if (type === 'PORT-SCAN') {
    totalPercent = (stats.value.by_type?.['DDOS'] || 0) / stats.value.total;
  } else if (type === 'BRUTE-FORCE') {
    totalPercent = ((stats.value.by_type?.['DDOS'] || 0) + (stats.value.by_type?.['PORT-SCAN'] || 0)) / stats.value.total;
  }
  return totalPercent * 360;
};

// Parse terminal message to extract prefix and body
const parseTerminalMessage = (msg) => {
  const match = msg.match(/^\[(LOG|DB|NOTIF|MITIGASI)\]\s*(.*)$/);
  if (match) {
    return { prefix: match[1], body: match[2] };
  }
  return { prefix: null, body: msg };
};

const handleAlertClick = (alert) => {
  // Data from /notif/history already uses correct field names (src_ip, attack_type, alert, port, insight)
  selectedLog.value = alert;
  isModalOpen.value = true;
};

const openLogDetails = (log) => {
  selectedLog.value = log;
  isModalOpen.value = true;
};

const togglePortStatus = async (port) => {
  try {
    if (port.status === 'on') {
      await disablePort(port.port, port.protocol || 'tcp');
    } else {
      await enablePort(port.port, port.protocol || 'tcp');
    }
    // Refresh ports after toggle
    await loadOpenPorts();
  } catch (error) {
    console.error('Failed to toggle port status:', error);
    window.alert(error.message || 'Failed to change port status');
  }
};

const loadOpenPorts = async () => {
  try {
    rawOpenPorts.value = await fetchOpenPorts();
  } catch (error) {
    console.error('Failed to load open ports:', error);
  }
};

const loadData = async () => {
  try {
    const [statsData, notifData, deviceData, portsData] = await Promise.all([
      fetchStatsSummary().catch(() => ({ total: 0 })),
      fetchNotifHistory(20).catch(() => []),
      fetchDevice().catch(() => null),
      fetchOpenPorts().catch(() => [])
    ]);
    stats.value = statsData;
    activeAlerts.value = notifData;
    device.value = deviceData;
    rawOpenPorts.value = portsData;
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
  }
};

// Debounce utility to prevent API spam on rapid WebSocket messages
let debounceTimer = null;
const debouncedLoadData = () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    loadData();
  }, 3000);
};

onMounted(() => {
  loadData();
  
  // Terminal WebSocket — shows ALL backend output ([LOG], [DB], [NOTIF], [MITIGASI])
  connectTerminalStream({
    onMessage: (data) => {
      const parsed = parseTerminalMessage(data.message || '');
      terminalLogs.value.push({
        timestamp: data.timestamp || new Date().toLocaleTimeString(),
        ...parsed
      });
      // Keep only last 200 lines in memory
      if (terminalLogs.value.length > 200) {
        terminalLogs.value.shift();
      }
      // Auto-scroll to bottom
      if (terminalContainer.value) {
        requestAnimationFrame(() => {
          terminalContainer.value.scrollTop = terminalContainer.value.scrollHeight;
        });
      }
    },
    onOpen: () => {
      isTerminalStreaming.value = true;
    },
    onClose: () => {
      isTerminalStreaming.value = false;
    }
  });

  // Alert WebSocket — updates stats & alert history on new alerts
  connectLogStream({
    onMessage: (data) => {
      // Refresh stats and alerts with debounce
      debouncedLoadData();
    },
    onOpen: () => {},
    onClose: () => {}
  });
});

onUnmounted(() => {
  disconnectTerminalStream();
  disconnectLogStream();
  if (debounceTimer) clearTimeout(debounceTimer);
  if (syncToastTimer) clearTimeout(syncToastTimer);
});
</script>

<style>
/* Toast positioning */
.sync-toast-container {
  top: 1rem;
  right: 1rem;
}

/* Mobile: center at top */
@media (max-width: 768px) {
  .sync-toast-container {
    top: 1rem;
    right: 50%;
    transform: translateX(50%);
  }
}

/* Toast Transitions — Desktop: slide from right */
.sync-toast-enter-active {
  transition: transform 0.35s cubic-bezier(0.21, 1.02, 0.73, 1), opacity 0.25s ease;
}
.sync-toast-leave-active {
  transition: transform 0.25s cubic-bezier(0.4, 0, 1, 1), opacity 0.2s ease;
}
.sync-toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.sync-toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Mobile transitions: slide from top */
@media (max-width: 768px) {
  .sync-toast-enter-from {
    opacity: 0;
    transform: translateX(50%) translateY(-100%);
  }
  .sync-toast-leave-to {
    opacity: 0;
    transform: translateX(50%) translateY(-100%);
  }
}

/* Progress bar animation */
.sync-toast-progress {
  animation: sync-toast-countdown 3s linear forwards;
}
@keyframes sync-toast-countdown {
  from { width: 100%; }
  to { width: 0%; }
}
</style>
