<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Title *
      </label>
      <input
        id="title"
        v-model="formData.title"
        type="text"
        required
        class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
        placeholder="Task title"
      />
    </div>

    <div>
      <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Description
      </label>
      <textarea
        id="description"
        v-model="formData.description"
        rows="3"
        class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
        placeholder="Task description"
      />
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label for="priority" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Priority
        </label>
        <select
          id="priority"
          v-model="formData.priority"
          class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label for="dueDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Due Date
        </label>
        <input
          id="dueDate"
          v-model="formData.dueDate"
          type="date"
          class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
    </div>

    <div>
      <label for="project" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Project
      </label>
      <input
        id="project"
        v-model="formData.project"
        type="text"
        class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
        placeholder="Project name"
      />
    </div>

    <div>
      <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Tags (comma-separated)
      </label>
      <input
        id="tags"
        v-model="tagsString"
        type="text"
        class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
        placeholder="tag1, tag2, tag3"
      />
    </div>

    <div class="flex justify-end space-x-3 pt-4">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        {{ editMode ? 'Update' : 'Create' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { Task } from '~/types/task';

const props = defineProps<{
  task?: Task;
}>();

const emit = defineEmits<{
  submit: [data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>];
  cancel: [];
}>();

const editMode = computed(() => !!props.task);

const formData = ref({
  title: '',
  description: '',
  completed: false,
  priority: 'medium' as Task['priority'],
  dueDate: '',
  project: '',
  tags: [] as string[]
});

const tagsString = ref('');

// Initialize form with task data if editing
watch(() => props.task, (task) => {
  if (task) {
    formData.value = {
      title: task.title,
      description: task.description || '',
      completed: task.completed,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      project: task.project || '',
      tags: task.tags || []
    };
    tagsString.value = task.tags?.join(', ') || '';
  }
}, { immediate: true });

const handleSubmit = () => {
  const tags = tagsString.value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);

  emit('submit', {
    title: formData.value.title,
    description: formData.value.description || undefined,
    completed: formData.value.completed,
    priority: formData.value.priority,
    dueDate: formData.value.dueDate ? new Date(formData.value.dueDate) : null,
    project: formData.value.project || undefined,
    tags: tags.length > 0 ? tags : undefined
  });
};
</script>
