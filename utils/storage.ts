import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { Task } from '~/types/task';

export class KizunaDatabase extends Dexie {
  tasks!: Table<Task, number>;

  constructor() {
    super('KizunaDB');
    this.version(1).stores({
      tasks: '++id, title, completed, dueDate, priority, project, createdAt, updatedAt'
    });
  }
}

export const db = new KizunaDatabase();

export class StorageAdapter {
  private db: KizunaDatabase;

  constructor(database: KizunaDatabase = db) {
    this.db = database;
  }

  // Create
  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const now = new Date();
    const newTask: Omit<Task, 'id'> = {
      ...task,
      createdAt: now,
      updatedAt: now
    };
    const id = await this.db.tasks.add(newTask as Task);
    return { ...newTask, id } as Task;
  }

  // Read
  async getTask(id: number): Promise<Task | undefined> {
    return await this.db.tasks.get(id);
  }

  async getAllTasks(): Promise<Task[]> {
    return await this.db.tasks.toArray();
  }

  async getTasksByFilter(filter: {
    completed?: boolean;
    project?: string;
    priority?: Task['priority'];
  }): Promise<Task[]> {
    let collection = this.db.tasks.toCollection();

    if (filter.completed !== undefined) {
      collection = this.db.tasks.where('completed').equals(filter.completed);
    }

    if (filter.project) {
      const tasks = await collection.toArray();
      return tasks.filter(task => task.project === filter.project);
    }

    if (filter.priority) {
      const tasks = await collection.toArray();
      return tasks.filter(task => task.priority === filter.priority);
    }

    return await collection.toArray();
  }

  async getTodayTasks(): Promise<Task[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = await this.db.tasks.toArray();
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate < tomorrow;
    });
  }

  async searchTasks(query: string): Promise<Task[]> {
    const allTasks = await this.db.tasks.toArray();
    const lowerQuery = query.toLowerCase();
    return allTasks.filter(task => 
      task.title.toLowerCase().includes(lowerQuery) ||
      task.description?.toLowerCase().includes(lowerQuery) ||
      task.project?.toLowerCase().includes(lowerQuery) ||
      task.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Update
  async updateTask(id: number, updates: Partial<Task>): Promise<void> {
    await this.db.tasks.update(id, {
      ...updates,
      updatedAt: new Date()
    });
  }

  // Delete
  async deleteTask(id: number): Promise<void> {
    await this.db.tasks.delete(id);
  }

  async deleteAllTasks(): Promise<void> {
    await this.db.tasks.clear();
  }

  // Export/Import
  async exportData(): Promise<string> {
    const tasks = await this.db.tasks.toArray();
    return JSON.stringify(tasks, null, 2);
  }

  async importData(jsonData: string): Promise<number> {
    try {
      const tasks: Task[] = JSON.parse(jsonData);
      await this.db.tasks.bulkAdd(tasks);
      return tasks.length;
    } catch (error) {
      throw new Error('Invalid import data format');
    }
  }
}

export const storage = new StorageAdapter();
