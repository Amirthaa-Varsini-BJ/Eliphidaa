import React, { useEffect, useState } from 'react';
import './Calendar.css';

const STATUS_ORDER = ['Not Started', 'In Progress', 'Done'];

const getNextStatus = (current) => {
  const index = STATUS_ORDER.indexOf(current);
  return STATUS_ORDER[(index + 1) % STATUS_ORDER.length];
};

const TaskCell = ({ date }) => {
  const storageKey = `tasks-${date.toDateString()}`;

  const [showForm, setShowForm] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [tasks, setTasks] = useState([]);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (taskName.trim() === '') return;
    const newTask = { name: taskName, status: 'Not Started' };
    setTasks([...tasks, newTask]);
    setTaskName('');
    setShowForm(false);
  };

  const updateStatus = (index) => {
    const newTasks = [...tasks];
    newTasks[index].status = getNextStatus(newTasks[index].status);
    setTasks(newTasks);
  };

  return (
    <div className="task-cell">
      <div className="cell-header">
        <span className="date">{date.getDate()}</span>
        {!showForm && (
          <button className="plus-btn" onClick={() => setShowForm(true)}>+</button>
        )}
      </div>

      {/* Task List */}
      {tasks.map((task, idx) => (
        <div className="task-card" key={idx}>
          <div className="task-title">{task.name || 'New page'}</div>
          <span
            className={`status-pill ${task.status.toLowerCase().replace(' ', '-')}`}
            onClick={() => updateStatus(idx)}
            title="Click to change status"
          >
            {task.status}
          </span>
        </div>
      ))}

      {/* Add Task Form */}
      {showForm && (
        <div className="task-form">
          <input
            type="text"
            placeholder="Task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <button className="save-btn" onClick={addTask}>✔</button>
        </div>
      )}
    </div>
  );
};

export default TaskCell;
