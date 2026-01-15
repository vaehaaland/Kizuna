import { defineStore } from 'pinia';
import type { Task, TaskFilter } from '~/types/task';
import { storage } from '~/utils/storage';

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],
    loading: false,
    error: null as string | null,
    filter: {
      search: '',
      completed: undefined,
      priority: undefined,
      project: undefined,
    } as TaskFilter,
  }),

  getters: {
    filteredTasks: (state) => {
      let filtered = [...state.tasks];

      if (state.filter.search) {
        const search = state.filter.search.toLowerCase();
        filtered = filtered.filter(task =>
          task.title.toLowerCase().includes(search) ||
          task.description?.toLowerCase().includes(search) ||
          task.project?.toLowerCase().includes(search) ||
          task.tags?.some(tag => tag.toLowerCase().includes(search))
        );
      }

      if (state.filter.completed !== undefined) {
        filtered = filtered.filter(task => task.completed === state.filter.completed);
      }

      if (state.filter.priority) {
        filtered = filtered.filter(task => task.priority === state.filter.priority);
      }

      if (state.filter.project) {
        filtered = filtered.filter(task => task.project === state.filter.project);
      }

      return filtered;
    },

    incompleteTasks: (state) => state.tasks.filter(task => !task.completed),
    
    completedTasks: (state) => state.tasks.filter(task => task.completed),

    todayTasks: (state) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      return state.tasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= today && dueDate < tomorrow && !task.completed;
      });
    },

    projects: (state) => {
      const projectSet = new Set<string>();
      state.tasks.forEach(task => {
        if (task.project) projectSet.add(task.project);
      });
      return Array.from(projectSet).sort();
    },

    tasksByProject: (state) => {
      const grouped: Record<string, Task[]> = {};
      state.tasks.forEach(task => {
        const project = task.project || 'No Project';
        if (!grouped[project]) {
          grouped[project] = [];
        }
        grouped[project].push(task);
      });
      return grouped;
    }
  },

  actions: {
    async loadTasks() {
      this.loading = true;
      this.error = null;
      try {
        this.tasks = await storage.getAllTasks();
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to load tasks';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true;
      this.error = null;
      try {
        const task = await storage.createTask(taskData);
        this.tasks.push(task);
        return task;
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to create task';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateTask(id: number, updates: Partial<Task>) {
      this.loading = true;
      this.error = null;
      try {
        await storage.updateTask(id, updates);
        const index = this.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
          this.tasks[index] = { ...this.tasks[index], ...updates, updatedAt: new Date() };
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to update task';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteTask(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await storage.deleteTask(id);
        this.tasks = this.tasks.filter(t => t.id !== id);
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to delete task';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async toggleTaskComplete(id: number) {
      const task = this.tasks.find(t => t.id === id);
      if (task) {
        await this.updateTask(id, { completed: !task.completed });
      }
    },

    setFilter(filter: Partial<TaskFilter>) {
      this.filter = { ...this.filter, ...filter };
    },

    clearFilter() {
      this.filter = {
        search: '',
        completed: undefined,
        priority: undefined,
        project: undefined,
      };
    },

    async exportTasks(): Promise<string> {
      try {
        return await storage.exportData();
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to export tasks';
        throw err;
      }
    },

    async importTasks(jsonData: string): Promise<number> {
      this.loading = true;
      this.error = null;
      try {
        const count = await storage.importData(jsonData);
        await this.loadTasks();
        return count;
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to import tasks';
        throw err;
      } finally {
        this.loading = false;
      }
    }
  }
});
