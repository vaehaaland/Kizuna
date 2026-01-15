<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="title" class="block text-sm font-medium text-[var(--text-primary)]">
        Title *
      </label>
      <input
        id="title"
        v-model="formData.title"
        type="text"
        required
        class="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--text-muted)]/30 bg-[var(--bg-card)] text-[var(--text-primary)] px-3 py-2 shadow-[var(--shadow-sm)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
        placeholder="Task title"
      />
    </div>

    <div>
      <label for="description" class="block text-sm font-medium text-[var(--text-primary)]">
        Description
      </label>
      <textarea
        id="description"
        v-model="formData.description"
        rows="3"
        class="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--text-muted)]/30 bg-[var(--bg-card)] text-[var(--text-primary)] px-3 py-2 shadow-[var(--shadow-sm)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
        placeholder="Task description"
      />
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label for="priority" class="block text-sm font-medium text-[var(--text-primary)]">
          Priority
        </label>
        <select
          id="priority"
          v-model="formData.priority"
          class="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--text-muted)]/30 bg-[var(--bg-card)] text-[var(--text-primary)] px-3 py-2 shadow-[var(--shadow-sm)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label for="dueDate" class="block text-sm font-medium text-[var(--text-primary)]">
          Due Date
        </label>
        <input
          id="dueDate"
          v-model="formData.dueDate"
          type="date"
          class="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--text-muted)]/30 bg-[var(--bg-card)] text-[var(--text-primary)] px-3 py-2 shadow-[var(--shadow-sm)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
        />
      </div>
    </div>

    <div>
      <label for="project" class="block text-sm font-medium text-[var(--text-primary)]">
        Project
      </label>
      <input
        id="project"
        v-model="formData.project"
        type="text"
        class="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--text-muted)]/30 bg-[var(--bg-card)] text-[var(--text-primary)] px-3 py-2 shadow-[var(--shadow-sm)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
        placeholder="Project name"
      />
    </div>

    <div>
      <label for="tags" class="block text-sm font-medium text-[var(--text-primary)]">
        Tags (comma-separated)
      </label>
      <input
        id="tags"
        v-model="tagsString"
        type="text"
        class="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--text-muted)]/30 bg-[var(--bg-card)] text-[var(--text-primary)] px-3 py-2 shadow-[var(--shadow-sm)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
        placeholder="tag1, tag2, tag3"
      />
    </div>

    <div class="flex justify-end space-x-3 pt-4">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-app)] border border-[var(--text-muted)]/30 rounded-[var(--radius-md)] hover:bg-[var(--bg-surface)] transition-all"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="px-4 py-2 text-sm font-medium text-white bg-[var(--primary)] border border-transparent rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all"
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
