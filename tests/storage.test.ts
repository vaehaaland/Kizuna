import { describe, it, expect, beforeEach } from 'vitest';
import { StorageAdapter, KizunaDatabase } from '../utils/storage';
import type { Task } from '../types/task';

describe('Storage Adapter', () => {
  let testDb: KizunaDatabase;
  let testStorage: StorageAdapter;

  beforeEach(async () => {
    // Create a new database instance for each test
    testDb = new KizunaDatabase();
    testStorage = new StorageAdapter(testDb);
    await testDb.tasks.clear();
  });

  it('should create a task', async () => {
    const taskData = {
      title: 'Test Task',
      description: 'Test Description',
      completed: false,
      priority: 'medium' as const,
      dueDate: new Date(),
      project: 'Test Project',
      tags: ['test']
    };

    const task = await testStorage.createTask(taskData);

    expect(task.id).toBeDefined();
    expect(task.title).toBe('Test Task');
    expect(task.completed).toBe(false);
  });

  it('should get all tasks', async () => {
    await testStorage.createTask({
      title: 'Task 1',
      completed: false,
      priority: 'low'
    });
    await testStorage.createTask({
      title: 'Task 2',
      completed: false,
      priority: 'high'
    });

    const tasks = await testStorage.getAllTasks();
    expect(tasks.length).toBeGreaterThanOrEqual(2);
  });

  it('should update a task', async () => {
    const task = await testStorage.createTask({
      title: 'Original Title',
      completed: false,
      priority: 'low'
    });

    if (task.id) {
      await testStorage.updateTask(task.id, { title: 'Updated Title' });
      const updatedTask = await testStorage.getTask(task.id);
      expect(updatedTask?.title).toBe('Updated Title');
    }
  });

  it('should delete a task', async () => {
    const task = await testStorage.createTask({
      title: 'To Be Deleted',
      completed: false,
      priority: 'low'
    });

    if (task.id) {
      await testStorage.deleteTask(task.id);
      const deletedTask = await testStorage.getTask(task.id);
      expect(deletedTask).toBeUndefined();
    }
  });

  it('should search tasks', async () => {
    await testStorage.createTask({
      title: 'Buy groceries',
      completed: false,
      priority: 'medium'
    });
    await testStorage.createTask({
      title: 'Write report',
      completed: false,
      priority: 'high'
    });

    const results = await testStorage.searchTasks('groceries');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].title).toContain('groceries');
  });

  it('should export and import data', async () => {
    await testStorage.createTask({
      title: 'Task to Export',
      completed: false,
      priority: 'low'
    });

    const exportedData = await testStorage.exportData();
    expect(exportedData).toBeTruthy();

    const parsed = JSON.parse(exportedData);
    expect(Array.isArray(parsed)).toBe(true);
  });
});
