
export enum TodoStatus {
  Open = 'open',
  Completed = 'completed',
  Abandoned = 'abandoned',
}

export interface Todo {
  id: string;
  title: string;
  date: string; // ISO YYYY-MM-DD
  status: TodoStatus;
  sortIndex: number;
  assignee?: string;
  difficulty?: number; // 1-5
  nextAction?: string;
  plan?: string;
  project?: string;
  scheduleInfo?: string;
  isMultiSession?: boolean;
  specialRequirements?: string;
  prerequisites?: string[]; // array of todo IDs
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export type TodoCreate = Omit<Todo, 'id' | 'status' | 'sortIndex' | 'createdAt' | 'updatedAt'> & { title: string; date: string };
export type TodoUpdate = Partial<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>;
