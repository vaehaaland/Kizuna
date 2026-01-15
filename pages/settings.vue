<template>
  <NuxtLayout>
    <div class="max-w-3xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-[var(--text-primary)] mb-8">Settings</h1>

      <div class="space-y-6">
        <!-- Theme Settings -->
        <div class="bg-[var(--bg-card)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] p-6 border border-[var(--text-muted)]/10">
          <h2 class="text-xl font-semibold text-[var(--text-primary)] mb-4">Theme</h2>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-[var(--text-secondary)]">
                Choose between light and dark mode
              </p>
            </div>
            <button
              @click="toggleTheme"
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
              :class="isDark ? 'bg-[var(--primary)]' : 'bg-[var(--text-muted)]/30'"
              role="switch"
              :aria-checked="isDark"
            >
              <span
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                :class="isDark ? 'translate-x-5' : 'translate-x-0'"
              ></span>
            </button>
          </div>
        </div>

        <!-- Data Management -->
        <div class="bg-[var(--bg-card)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] p-6 border border-[var(--text-muted)]/10">
          <h2 class="text-xl font-semibold text-[var(--text-primary)] mb-4">Data Management</h2>
          
          <!-- Export -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-[var(--text-primary)] mb-2">Export Tasks</h3>
            <p class="text-sm text-[var(--text-secondary)] mb-3">
              Download all your tasks as a JSON file
            </p>
            <button
              @click="handleExport"
              class="inline-flex items-center px-4 py-2 border border-[var(--text-muted)]/30 shadow-[var(--shadow-sm)] text-sm font-medium rounded-[var(--radius-md)] text-[var(--text-primary)] bg-[var(--bg-surface)] hover:bg-[var(--bg-app)] transition-all"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Data
            </button>
          </div>

          <!-- Import -->
          <div>
            <h3 class="text-sm font-medium text-[var(--text-primary)] mb-2">Import Tasks</h3>
            <p class="text-sm text-[var(--text-secondary)] mb-3">
              Upload a JSON file to import tasks
            </p>
            <input
              ref="fileInput"
              type="file"
              accept=".json"
              @change="handleImport"
              class="hidden"
            />
            <button
              @click="fileInput?.click()"
              class="inline-flex items-center px-4 py-2 border border-[var(--text-muted)]/30 shadow-[var(--shadow-sm)] text-sm font-medium rounded-[var(--radius-md)] text-[var(--text-primary)] bg-[var(--bg-surface)] hover:bg-[var(--bg-app)] transition-all"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Import Data
            </button>
            <p v-if="importMessage" class="mt-2 text-sm" :class="importSuccess ? 'text-[var(--success)]' : 'text-[var(--danger)]'">
              {{ importMessage }}
            </p>
          </div>
        </div>

        <!-- Keyboard Shortcuts -->
        <div class="bg-[var(--bg-card)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] p-6 border border-[var(--text-muted)]/10">
          <h2 class="text-xl font-semibold text-[var(--text-primary)] mb-4">Keyboard Shortcuts</h2>
          <div class="space-y-2">
            <div class="flex justify-between items-center py-2 border-b border-[var(--text-muted)]/20">
              <span class="text-sm text-[var(--text-secondary)]">Create new task</span>
              <kbd class="px-2 py-1 text-xs font-semibold text-[var(--text-primary)] bg-[var(--bg-app)] border border-[var(--text-muted)]/30 rounded-[var(--radius-sm)]">Ctrl+N</kbd>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-[var(--text-muted)]/20">
              <span class="text-sm text-[var(--text-secondary)]">Focus search</span>
              <kbd class="px-2 py-1 text-xs font-semibold text-[var(--text-primary)] bg-[var(--bg-app)] border border-[var(--text-muted)]/30 rounded-[var(--radius-sm)]">Ctrl+F</kbd>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-sm text-[var(--text-secondary)]">Toggle theme</span>
              <span class="text-xs text-[var(--text-muted)]">Click sun/moon icon</span>
            </div>
          </div>
        </div>

        <!-- About -->
        <div class="bg-[var(--bg-card)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] p-6 border border-[var(--text-muted)]/10">
          <h2 class="text-xl font-semibold text-[var(--text-primary)] mb-4">About</h2>
          <p class="text-sm text-[var(--text-secondary)]">
            Kizuna 2026.01.1 - Fast, efficient and feature rich ToDo application built for ease of use and time tracking
          </p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTaskStore } from '~/stores/tasks';

const { isDark, toggleTheme } = useTheme();
const taskStore = useTaskStore();
const fileInput = ref<HTMLInputElement | null>(null);
const importMessage = ref('');
const importSuccess = ref(false);

const handleExport = async () => {
  try {
    const data = await taskStore.exportTasks();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kizuna-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    alert('Failed to export data');
  }
};

const handleImport = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  
  if (!file) return;

  try {
    const text = await file.text();
    const count = await taskStore.importTasks(text);
    importMessage.value = `Successfully imported ${count} tasks`;
    importSuccess.value = true;
    
    // Clear message after 3 seconds
    setTimeout(() => {
      importMessage.value = '';
    }, 3000);
  } catch (error) {
    importMessage.value = 'Failed to import data. Please check the file format.';
    importSuccess.value = false;
  }
  
  // Reset input
  input.value = '';
};
</script>
