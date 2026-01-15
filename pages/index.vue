<template>
  <NuxtLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Inbox</h1>
        <button
          @click="showTaskForm = true"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </div>

      <!-- Search Bar -->
      <div class="mb-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search tasks..."
          class="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <!-- Error Message -->
      <div v-if="taskStore.error" class="mb-4 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md">
        <p class="text-red-800 dark:text-red-200">{{ taskStore.error }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="taskStore.loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>

      <!-- Task List -->
      <div v-else-if="filteredTasks.length > 0" class="space-y-4">
        <TaskItem
          v-for="task in filteredTasks"
          :key="task.id"
          :task="task"
          @toggle="handleToggle"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>

      <!-- Empty State -->
      <EmptyState
        v-else
        title="No tasks yet"
        description="Get started by creating your first task."
        :show-action="true"
        action-text="Create Task"
        @action="showTaskForm = true"
      />

      <!-- Task Form Modal -->
      <Modal :show="showTaskForm" :title="editingTask ? 'Edit Task' : 'New Task'" @close="closeTaskForm">
        <TaskForm :task="editingTask" @submit="handleSubmit" @cancel="closeTaskForm" />
      </Modal>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTaskStore } from '~/stores/tasks';
import type { Task } from '~/types/task';

const taskStore = useTaskStore();
const showTaskForm = ref(false);
const editingTask = ref<Task | undefined>(undefined);
const searchQuery = ref('');

onMounted(() => {
  taskStore.loadTasks();
});

const filteredTasks = computed(() => {
  if (!searchQuery.value) {
    return taskStore.incompleteTasks;
  }
  taskStore.setFilter({ search: searchQuery.value });
  return taskStore.filteredTasks.filter(t => !t.completed);
});

const handleToggle = async (id: number | undefined) => {
  if (id) {
    await taskStore.toggleTaskComplete(id);
  }
};

const handleEdit = (task: Task) => {
  editingTask.value = task;
  showTaskForm.value = true;
};

const handleDelete = async (id: number | undefined) => {
  if (id && confirm('Are you sure you want to delete this task?')) {
    await taskStore.deleteTask(id);
  }
};

const handleSubmit = async (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
  if (editingTask.value?.id) {
    await taskStore.updateTask(editingTask.value.id, data);
  } else {
    await taskStore.createTask(data);
  }
  closeTaskForm();
};

const closeTaskForm = () => {
  showTaskForm.value = false;
  editingTask.value = undefined;
};

// Keyboard shortcuts
useKeyboardShortcuts([
  {
    key: 'n',
    ctrl: true,
    handler: () => showTaskForm.value = true,
    description: 'Create new task'
  },
  {
    key: 'f',
    ctrl: true,
    handler: () => {
      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      searchInput?.focus();
    },
    description: 'Focus search'
  }
]);
</script>
