<template>
  <div class="text-center py-12">
    <svg
      class="mx-auto h-12 w-12 text-[var(--text-muted)]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    </svg>
    <h3 class="mt-2 text-sm font-medium text-[var(--text-primary)]">{{ title }}</h3>
    <p class="mt-1 text-sm text-[var(--text-secondary)]">{{ description }}</p>
    <div v-if="showAction" class="mt-6">
      <button
        @click="$emit('action')"
        class="inline-flex items-center px-4 py-2 border border-transparent shadow-[var(--shadow-sm)] text-sm font-medium rounded-[var(--radius-md)] text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] hover:shadow-[var(--shadow-md)] transition-all"
      >
        <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ actionText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  showAction?: boolean;
  actionText?: string;
}>();

defineEmits<{
  action: [];
}>();
</script>
