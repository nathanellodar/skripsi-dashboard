<template>
  <div class="bg-gradient-to-br from-[#0B1120] via-[#101935] to-[#0B1120] text-on-background min-h-screen flex items-center justify-center font-body-md antialiased relative overflow-hidden">
    
    <!-- Elegant Gradient Glows -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px]"></div>
    </div>

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

  </div>
</template>

<script setup>
// Auth layout wrapper integrates the complex background from the Stitch login pages
</script>
