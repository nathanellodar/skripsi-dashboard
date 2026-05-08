<template>
  <div class="bg-white overflow-hidden shadow rounded-lg transition-elegant hover:shadow-md border border-gray-100">
    <div class="p-5">
      <div class="flex items-center">
        <div class="flex-shrink-0 bg-emerald-100 rounded-md p-3">
          <!-- Default Icon if no slot provided -->
          <slot name="icon">
            <svg class="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </slot>
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 truncate">{{ title }}</dt>
            <dd>
              <div class="text-lg font-medium text-gray-900">{{ value }}</div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  }
});
</script>
