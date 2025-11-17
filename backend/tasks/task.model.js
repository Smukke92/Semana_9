export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface CreateTaskDto {
  title: string;
}

export interface UpdateTaskDto {
  title?: string;
  completed?: boolean;
}
