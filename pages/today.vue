<template>
  <NuxtLayout>
    <div class="mx-auto max-w-3xl px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-[var(--text-primary)]">Today</h1>
        <button
          @click="showTaskForm = true"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-[var(--shadow-sm)] text-sm font-medium rounded-[var(--radius-md)] text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] hover:shadow-[var(--shadow-md)] transition-all"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="taskStore.loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
      </div>

      <!-- Task List -->
      <div v-else-if="taskStore.todayTasks.length > 0" class="space-y-3">
        <TaskItem
          v-for="task in taskStore.todayTasks"
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
        title="No tasks for today"
        description="You don't have any tasks scheduled for today. Enjoy your free time!"
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
import { ref, onMounted } from 'vue';
import { useTaskStore } from '~/stores/tasks';
import type { Task } from '~/types/task';

const taskStore = useTaskStore();
const showTaskForm = ref(false);
const editingTask = ref<Task | undefined>(undefined);

onMounted(() => {
  taskStore.loadTasks();
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
  }
]);
</script>
