<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
    <div class="flex items-start space-x-3">
      <input
        type="checkbox"
        :checked="task.completed"
        @change="$emit('toggle', task.id)"
        class="mt-1 h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
        :aria-label="`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`"
      />
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <h3
            class="text-sm font-medium truncate"
            :class="task.completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'"
          >
            {{ task.title }}
          </h3>
          <div class="flex items-center space-x-2 ml-2">
            <span
              v-if="task.priority"
              class="px-2 py-1 text-xs font-medium rounded"
              :class="priorityClass(task.priority)"
            >
              {{ task.priority }}
            </span>
            <button
              @click="$emit('edit', task)"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Edit task"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="$emit('delete', task.id)"
              class="text-red-400 hover:text-red-600 dark:hover:text-red-300"
              aria-label="Delete task"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        <p v-if="task.description" class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {{ task.description }}
        </p>
        <div class="mt-2 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span v-if="task.project" class="inline-flex items-center">
            <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            {{ task.project }}
          </span>
          <span v-if="task.dueDate" class="inline-flex items-center">
            <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ formatDate(task.dueDate) }}
          </span>
          <span v-if="task.tags && task.tags.length > 0" class="inline-flex items-center">
            <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {{ task.tags.join(', ') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/types/task';

defineProps<{
  task: Task;
}>();

defineEmits<{
  toggle: [id: number | undefined];
  edit: [task: Task];
  delete: [id: number | undefined];
}>();

const priorityClass = (priority: Task['priority']) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
    case 'medium':
      return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
    case 'low':
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
  }
};

const formatDate = (date: Date | null | undefined) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString();
};
</script>
