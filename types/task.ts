export interface Task {
  id?: number;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date | null;
  priority: 'low' | 'medium' | 'high';
  project?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFilter {
  search?: string;
  completed?: boolean;
  priority?: Task['priority'];
  project?: string;
  tag?: string;
  dueDate?: Date;
}
