<template>
  <div class="flex flex-col h-full space-y-6">
    <header class="mb-2">
      <h1 class="font-headline-xl text-[32px] md:text-[40px] leading-none mb-2 text-on-surface tracking-tight">Dashboard</h1>
      <p class="text-body-md font-body-md text-on-surface-variant">Real-time system health and security overview.</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      <!-- Left Column: Gateway Details & Ports -->
      <div class="lg:col-span-3 flex flex-col gap-6">
        
        <!-- Gateway Details -->
        <div class="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <!-- Subtle Glow -->
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-[var(--color-primary-container)]/10 rounded-full blur-2xl group-hover:bg-[var(--color-primary-container)]/20 transition-all duration-500"></div>
          
          <h2 class="font-headline-lg text-[18px] text-on-surface mb-4 border-b border-white/5 pb-3">Gateway Details</h2>
          <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center">
              <span class="font-body-sm text-sm text-on-surface-variant">Brand</span>
              <span class="font-body-sm text-sm text-on-surface font-medium">NetGuard Pro</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-body-sm text-sm text-on-surface-variant">Model</span>
              <span class="font-body-sm text-sm text-on-surface font-medium">NG-8000x</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-body-sm text-sm text-on-surface-variant">Identity</span>
              <span class="font-code-log text-xs text-[var(--color-primary-container)] bg-surface-container px-2 py-1 rounded shadow-inner">Core-Router-Alpha</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-body-sm text-sm text-on-surface-variant">Public IP</span>
              <span class="font-code-log text-xs text-on-surface bg-surface-container px-2 py-1 rounded shadow-inner">192.168.1.254</span>
            </div>
            <div class="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <div class="flex items-center gap-2 text-sm text-on-surface-variant">
                <span class="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span>
                <span>Online</span>
              </div>
              <div class="flex items-center gap-1 text-sm text-[var(--color-primary)]">
                <span class="material-symbols-outlined text-[16px]">update</span>
                <span>{{ stats.systemUptime || '99.99%' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Port Management -->
        <div class="glass-card rounded-2xl p-6">
          <div class="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
            <h2 class="font-headline-lg text-[18px] text-on-surface">Port Status</h2>
            <span class="material-symbols-outlined text-[var(--color-primary-container)] text-sm">router</span>
          </div>
          <div class="grid grid-cols-4 gap-3">
            <div v-for="port in ports" :key="port.port" 
                 @click="togglePortStatus(port)"
                 class="border rounded-xl flex flex-col items-center py-3 relative overflow-hidden group cursor-pointer transition-elegant"
                 :class="{
                   'bg-[var(--color-primary-container)]/10 border-[var(--color-primary-container)]/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]': port.status === 'on',
                   'bg-surface-container border-white/5 shadow-inner hover:border-[var(--color-primary-container)]/50': port.status === 'off'
                 }">
              <span class="font-code-log text-sm font-semibold"
                    :class="port.status === 'on' ? 'text-[var(--color-primary)]' : 'text-on-surface'">
                {{ port.port }}
              </span>
              <span class="text-[10px] uppercase font-bold mt-1"
                    :class="port.status === 'on' ? 'text-[var(--color-primary)]/80' : 'text-on-surface-variant'">
                {{ port.name }}
              </span>
              
              <!-- Stats block in a vertical layout to prevent overflow -->
              <div class="mt-2 w-full px-3 flex flex-col gap-1"
                   :class="port.status === 'on' ? 'text-on-surface' : 'text-on-surface-variant'">
                <div class="flex justify-between items-center bg-black/20 px-1.5 py-0.5 rounded border border-white/5" title="Total Serangan">
                  <span class="material-symbols-outlined text-[11px] text-[var(--color-error)]">warning</span>
                  <span class="font-mono text-[9px]">{{ port.attacks }}</span>
                </div>
                <div class="flex justify-between items-center bg-black/20 px-1.5 py-0.5 rounded border border-white/5" title="Total Paket">
                  <span class="material-symbols-outlined text-[11px] text-[var(--color-primary)]">data_usage</span>
                  <span class="font-mono text-[9px]">{{ port.packets >= 1000 ? (port.packets / 1000).toFixed(port.packets % 1000 === 0 ? 0 : 1) + 'k' : port.packets }}</span>
                </div>
              </div>
              
              <span class="absolute bottom-0 w-full h-1 opacity-80"
                    :class="port.status === 'on' ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,1)]' : 'bg-[var(--color-error)]'"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Center Column: Live Traffic Logs -->
      <div class="lg:col-span-5 h-full min-h-[500px] flex flex-col">
        <div class="glass-card rounded-2xl p-0 flex flex-col h-full overflow-hidden border border-white/5 relative shadow-2xl">
          <!-- Top Border Accent -->
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-primary-container)] to-[var(--color-tertiary)]"></div>
          
          <div class="p-5 border-b border-white/5 bg-surface/30 flex justify-between items-center backdrop-blur-md">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-[var(--color-primary-container)]/20 flex items-center justify-center text-[var(--color-primary-container)]">
                <span class="material-symbols-outlined text-[18px]">terminal</span>
              </div>
              <h2 class="font-headline-lg text-[18px] text-on-surface">Live Traffic Logs</h2>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-headline-lg text-[14px] text-on-surface-variant whitespace-nowrap">Filter:</span>
              <div class="flex items-center gap-1">
                <input type="date" v-model="filterStartDate" class="bg-surface-container border border-white/10 text-on-surface-variant px-2.5 py-1.5 rounded-lg text-xs font-body-sm focus:border-[var(--color-primary-container)] focus:ring-1 focus:ring-[var(--color-primary-container)] outline-none transition-elegant w-[120px]" title="Start Date" />
                <span class="text-on-surface-variant text-xs font-bold">-</span>
                <input type="date" v-model="filterEndDate" class="bg-surface-container border border-white/10 text-on-surface-variant px-2.5 py-1.5 rounded-lg text-xs font-body-sm focus:border-[var(--color-primary-container)] focus:ring-1 focus:ring-[var(--color-primary-container)] outline-none transition-elegant w-[120px]" title="End Date" />
              </div>
            </div>
          </div>
          <div class="flex-1 bg-surface-container-lowest p-5 overflow-y-auto font-code-log text-xs flex flex-col gap-3">
            <div v-if="isLoading" class="animate-pulse text-on-surface-variant p-2 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[var(--color-primary-container)] animate-bounce"></span> Loading secure logs...
            </div>
            <div v-else-if="logs.length === 0" class="text-on-surface-variant p-2">No active logs.</div>
            <div v-else v-for="log in logs" :key="log.id" 
                 @click="openLogDetails(log)"
                 class="flex gap-3 text-on-surface-variant hover:bg-surface-container hover:text-on-surface p-2.5 rounded-lg cursor-pointer transition-elegant border border-transparent hover:border-white/5 group">
              <span class="text-outline whitespace-nowrap group-hover:text-[var(--color-primary)] transition-colors">{{ new Date(log.timestamp).toLocaleTimeString() }}</span>
              
              <span v-if="log.action === 'BLOCKED'" class="text-[var(--color-error)] font-bold drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]">[CRIT]</span>
              <span v-else-if="log.action === 'FLAGGED'" class="text-[var(--color-warning)] font-bold">[WARN]</span>
              <span v-else class="text-[var(--color-primary)] font-bold">[INFO]</span>
              
              <span :class="{'text-red-300': log.action === 'BLOCKED', 'text-stone-300': log.action !== 'BLOCKED'}">
                {{ log.description }} (Src: <span class="text-[var(--color-primary-container)]">{{ log.sourceIp }}</span>)
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Threat Distribution & Alerts -->
      <div class="lg:col-span-4 flex flex-col gap-6">
        
        <!-- Attack Statistics -->
        <div class="glass-card rounded-2xl p-6">
          <h2 class="font-headline-lg text-[18px] text-on-surface mb-6 border-b border-white/5 pb-3">Threat Distribution (24h)</h2>
          
          <div class="flex flex-col items-center justify-center py-2">
            <!-- Modern Donut Chart representation -->
            <div class="relative w-48 h-48 mb-6">
              <!-- SVG Donut Chart -->
              <svg viewBox="0 0 100 100" class="w-full h-full transform -rotate-90 drop-shadow-2xl">
                <!-- Background circle -->
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" stroke-width="12"></circle>
                
                <!-- DDoS (20%) -->
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-tertiary)" stroke-width="12" stroke-dasharray="251.2" stroke-dashoffset="200.96"></circle>
                <!-- Port Scan (35%) -->
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-error)" stroke-width="12" stroke-dasharray="251.2" stroke-dashoffset="113.04" class="origin-center rotate-[72deg]"></circle>
                <!-- Brute Force (45%) -->
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-primary-container)" stroke-width="12" stroke-dasharray="251.2" stroke-dashoffset="138.16" class="origin-center rotate-[198deg]"></circle>
              </svg>
              
              <!-- Center Total Label -->
              <div class="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-surface-container-lowest/50 shadow-inner">
                <span class="text-[32px] font-black text-on-surface drop-shadow-lg leading-none">{{ stats.threatsBlocked || '0' }}</span>
                <span class="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Total Threats</span>
              </div>
            </div>

            <!-- Legend with Counts -->
            <div class="w-full flex justify-between gap-2 border-t border-white/5 pt-5">
              <div class="flex flex-col items-center gap-1">
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-[var(--color-primary-container)] shadow-[0_0_8px_var(--color-primary-container)]"></span>
                  <span class="font-body-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Brute Force</span>
                </div>
                <span class="text-sm font-bold text-on-surface">15</span>
              </div>
              <div class="flex flex-col items-center gap-1 border-l border-r border-white/5 px-4">
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-[var(--color-error)] shadow-[0_0_8px_var(--color-error)]"></span>
                  <span class="font-body-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Port Scan</span>
                </div>
                <span class="text-sm font-bold text-on-surface">12</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-[var(--color-tertiary)] shadow-[0_0_8px_var(--color-tertiary)]"></span>
                  <span class="font-body-sm text-[11px] text-on-surface-variant uppercase tracking-wider">DDoS</span>
                </div>
                <span class="text-sm font-bold text-on-surface">7</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Alerts -->
        <div class="glass-card rounded-2xl p-6 flex-1 flex flex-col">
          <div class="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
            <h2 class="font-headline-lg text-[18px] text-on-surface">Active Alerts</h2>
            <span v-if="unreadCount > 0" class="bg-[var(--color-error)]/20 text-[var(--color-error)] border border-[var(--color-error)]/30 text-[10px] font-bold px-2 py-1 rounded shadow-[0_0_10px_rgba(248,113,113,0.2)]">
              {{ unreadCount }} New
            </span>
          </div>
          <div class="flex flex-col gap-3 overflow-y-auto">
            <div v-for="alert in activeAlerts" :key="alert.id"
                 @click="handleAlertClick(alert)"
                 class="border rounded-xl p-4 flex flex-col gap-2 transition-elegant cursor-pointer group relative overflow-hidden"
                 :class="alert.isRead ? 'bg-surface-container/50 border-white/5 opacity-70' : 'bg-surface-container border-white/10 hover:bg-surface-container-highest shadow-lg'">
              
              <!-- Unread Indicator Dot -->
              <div v-if="!alert.isRead" class="absolute top-4 right-4 w-2 h-2 rounded-full bg-[var(--color-error)] shadow-[0_0_8px_var(--color-error)]"></div>

              <div class="flex justify-between items-start pr-6">
                <span class="font-body-sm text-sm font-semibold transition-all"
                      :class="alert.action === 'BLOCKED' ? 'text-[var(--color-error)] group-hover:drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]' : 'text-[var(--color-primary-container)] group-hover:drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]'">
                  {{ alert.description }}
                </span>
                <span class="font-body-sm text-[10px] text-on-surface-variant">{{ alert.timeAgo }}</span>
              </div>
              <div class="font-code-log text-xs text-on-surface-variant bg-surface-container-lowest p-2 rounded border border-white/5">
                SRC: <span class="text-on-surface">{{ alert.sourceIp }}</span> | 
                {{ alert.range ? 'RANGE:' : 'PORT:' }} <span class="text-[var(--color-primary)]">{{ alert.port || alert.range }}</span>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import LogDetailModal from '../components/LogDetailModal.vue';
import { fetchDashboardStats, fetchLogs } from '../api/gateway';

const stats = ref({});
const logs = ref([]);
const isLoading = ref(true);

const isModalOpen = ref(false);
const selectedLog = ref(null);

const filterStartDate = ref('');
const filterEndDate = ref('');

const ports = ref([
  { port: 21, name: 'FTP', status: 'off', attacks: 0, packets: 0 },
  { port: 22, name: 'SSH', status: 'off', attacks: 15, packets: 3400 },
  { port: 80, name: 'HTTP', status: 'on', attacks: 6, packets: 78000 },
  { port: 443, name: 'HTTPS', status: 'on', attacks: 2, packets: 125000 }
]);

const activeAlerts = ref([
  {
    id: 'ALT-001',
    description: 'Brute Force Attack',
    timeAgo: '2 mins ago',
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    sourceIp: '45.33.22.11',
    port: '22',
    action: 'BLOCKED',
    isRead: false
  },
  {
    id: 'ALT-002',
    description: 'Suspicious Port Scan',
    timeAgo: '15 mins ago',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    sourceIp: '198.51.100.44',
    range: '1-1024',
    port: '1-1024',
    action: 'FLAGGED',
    isRead: false
  }
]);

const unreadCount = computed(() => activeAlerts.value.filter(alert => !alert.isRead).length);

const handleAlertClick = (alert) => {
  if (!alert.isRead) {
    // Di sini nanti bisa panggil API untuk set mark as read
    // api.markAlertAsRead(alert.id);
    alert.isRead = true;
  }
  openLogDetails(alert);
};

const togglePortStatus = async (port) => {
  // In the future this can call an API to change the port status
  try {
    // await api.togglePort(port.port, port.status === 'on' ? 'off' : 'on');
    port.status = port.status === 'on' ? 'off' : 'on';
  } catch (error) {
    console.error('Failed to toggle port status:', error);
  }
};

const loadData = async () => {
  isLoading.value = true;
  try {
    const [statsData, logsData] = await Promise.all([
      fetchDashboardStats(),
      fetchLogs()
    ]);
    stats.value = statsData;
    logs.value = logsData;
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
  } finally {
    isLoading.value = false;
  }
};

const openLogDetails = (log) => {
  selectedLog.value = log;
  isModalOpen.value = true;
};

onMounted(() => {
  loadData();
});
</script>
