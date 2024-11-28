import React, { useEffect, useState } from 'react';
import { getTasks, getStats, addTask, deleteTask } from './services/taskService';
import './App.css'; // Assuming CSS for styling

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('startTime'); // Default sort by startTime
  const [newTask, setNewTask] = useState({
    title: '',
    startTime: '',
    endTime: '',
    priority: 1,
    status: 'Pending',
  });

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      const response = await getTasks(filters, sortBy); // Send sortBy as a query parameter
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Fetch Stats
  const fetchStats = async () => {
    try {
      const response = await getStats();  // Fetch updated stats from the backend
      setStats(response.data); // Update the stats with the latest data
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Handle Adding a Task
  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      // Validate that all fields are filled
      if (!newTask.title || !newTask.startTime || !newTask.endTime) {
        alert('Please fill in all fields.');
        return;
      }

      // Add the new task
      const response = await addTask(newTask);
      console.log('Task added:', response); // Debugging line to check the response

      // If task is successfully added, update tasks state
      if (response.data) {
        setTasks((prevTasks) => [...prevTasks, response.data]); // Add the new task to the list
        setNewTask({
          title: '',
          startTime: '',
          endTime: '',
          priority: 1,
          status: 'Pending',
        }); // Reset form fields
      } else {
        console.error('Failed to add task:', response); // Handle unexpected response
      }

      // Re-fetch stats to update
      fetchStats();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Handle Deleting a Task
  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id)); // Remove task from state

      // Re-fetch stats to update
      fetchStats();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Handle Sorting
  const handleSort = (field) => {
    setSortBy(field); // Update the sort field
  };

  // Effect to Load Data
  useEffect(() => {
    fetchTasks();
    fetchStats(); // Fetch stats on initial load and whenever tasks change
  }, [filters, sortBy]); // Re-fetch tasks and stats whenever filters or sortBy change

  return (
    <div className="app">
      <header className="header">
        <h1>Task Manager</h1>
      </header>

      <section className="stats">
        <h2>Statistics</h2>
        <div className="stats-grid">
          <div>
            <p>Total Tasks:</p>
            <strong>{stats.totalTasks || 0}</strong>
          </div>
          <div>
            <p>Completed:</p>
            <strong>{stats.completedPercentage?.toFixed(2) || 0}%</strong>
          </div>
          <div>
            <p>Pending:</p>
            <strong>{stats.pendingPercentage?.toFixed(2) || 0}%</strong>
          </div>
          <div>
            <p>Time Lapsed:</p>
            <strong>{stats.timeLapsed?.toFixed(2) || 0} hours</strong>
          </div>
          <div>
            <p>Estimated Time Remaining:</p>
            <strong>{stats.balanceTime?.toFixed(2) || 0} hours</strong>
          </div>
          <div>
            <p>Average Completion Time:</p>
            <strong>{stats.averageCompletionTime?.toFixed(2) || 0} hours</strong>
          </div>
        </div>
      </section>

      <section className="tasks">
        <h2>Tasks</h2>
        <form className="add-task-form" onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <input
            type="datetime-local"
            placeholder="Start Time"
            value={newTask.startTime}
            onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
            required
          />
          <input
            type="datetime-local"
            placeholder="End Time"
            value={newTask.endTime}
            onChange={(e) => setNewTask({ ...newTask, endTime: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Priority (1-5)"
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: parseInt(e.target.value) })}
            min="1"
            max="5"
            required
          />
          <select
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          >
            <option value="Pending">Pending</option>
            <option value="Finished">Finished</option>
          </select>
          <button type="submit" className="button">Add Task</button>
        </form>

        <div className="controls">
          <button onClick={() => handleSort('startTime')} className="button">
            Sort by Start Time
          </button>
          <button onClick={() => handleSort('endTime')} className="button">
            Sort by End Time
          </button>
        </div>

        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              <div className="task-info">
                <h3>{task.title}</h3>
                <p>
                  <strong>Status:</strong> {task.status}
                </p>
                <p>
                  <strong>Start Time:</strong> {new Date(task.startTime).toLocaleString()}
                </p>
                <p>
                  <strong>End Time:</strong> {new Date(task.endTime).toLocaleString()}
                </p>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDeleteTask(task._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default App;
