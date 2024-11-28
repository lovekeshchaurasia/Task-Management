import axios from 'axios';

// Fetch tasks based on filters and sorting
export const getTasks = async (filters, sortBy) => {
  const query = new URLSearchParams({ ...filters, sortBy }).toString();
  return await axios.get(`/tasks?${query}`);
};

// Fetch statistics
export const getStats = async () => {
  return await axios.get('/tasks/stats');
};

// Add a new task
export const addTask = async (taskData) => {
  return await axios.post('/tasks', taskData);
};

// Delete a task by ID
export const deleteTask = async (id) => {
  return await axios.delete(`/tasks/${id}`);
};
