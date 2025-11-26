import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { FaChevronLeft, FaChevronRight, FaPlus, FaRegClock } from 'react-icons/fa';
import './Calendar.css';
import 'react-calendar/dist/Calendar.css';

// ======= TaskCell Component =======
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

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setTasks(JSON.parse(stored));
  }, []);

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
        {!showForm && <button className="plus-btn" onClick={() => setShowForm(true)}>+</button>}
      </div>

      {tasks.map((task, idx) => (
        <div className="task-card" key={idx}>
          <div className="task-title">{task.name || 'New task'}</div>
          <span
            className={`status-pill ${task.status.toLowerCase().replace(' ', '-')}`}
            onClick={() => updateStatus(idx)}
            title="Click to change status"
          >
            {task.status}
          </span>
        </div>
      ))}

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

// ======= TaskPanel Component =======
const generateCalendarGrid = () => {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const days = [];
  for (let i = 1; i <= end.getDate(); i++) {
    const date = new Date(today.getFullYear(), today.getMonth(), i);
    days.push(<TaskCell key={i} date={date} />);
  }
  return days;
};

const TaskPanel = ({ show, onClose }) => {
  return (
    <div className={`task-panel ${show ? 'open' : ''}`}>
      <div className="panel-header">
        <h3>Task Calendar</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      <div className="big-calendar-grid">
        {generateCalendarGrid()}
      </div>
    </div>
  );
};

// ======= Main CalendarAndTasks Component =======
const CalendarAndTasks = () => {
  // Calendar & task panel
  const [showPanel, setShowPanel] = useState(false);
  const togglePanel = () => setShowPanel(!showPanel);

  // Inline mini calendar tasks
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 5));
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 6, 5));
  const [tasksMap, setTasksMap] = useState({});
  const [newTask, setNewTask] = useState('');

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(<div key={`empty-${i}`}></div>);
  for (let day = 1; day <= daysInMonth; day++) {
    const isSelected = selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear();
    calendarDays.push(
      <button
        key={day}
        onClick={() => setSelectedDate(new Date(year, currentDate.getMonth(), day))}
        className={`calendar-day ${isSelected ? 'selected' : ''}`}
      >
        {day}
      </button>
    );
  }

  const changeMonth = (offset) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const addTask = () => {
    if (newTask.trim() === '') return;
    const dateKey = selectedDate.toISOString().split('T')[0];
    const updatedTasks = { ...tasksMap };
    if (!updatedTasks[dateKey]) updatedTasks[dateKey] = [];
    updatedTasks[dateKey].push(newTask.trim());
    setTasksMap(updatedTasks);
    setNewTask('');
  };

  const selectedDateKey = selectedDate.toISOString().split('T')[0];
  const todaysTasks = tasksMap[selectedDateKey] || [];

  return (
    <div className="calendar-page">
      <div className="main-content">
        <div className="calendar-card">
          <h2 className="calendar-title">Mini Calendar & Tasks</h2>

          <div className="calendar-header">
            <button onClick={() => changeMonth(-1)}><FaChevronLeft /></button>
            <div>{monthName} {year}</div>
            <button onClick={() => changeMonth(1)}><FaChevronRight /></button>
          </div>

          <div className="weekdays">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}</div>
          <div className="calendar-grid">{calendarDays}</div>

          <h3 className="tasks-heading">
            Tasks for {selectedDate.toLocaleDateString('en-GB')}
          </h3>
          <div className="tasks-list">
            {todaysTasks.length > 0 ? (
              todaysTasks.map((task, idx) => <p key={idx}>- {task}</p>)
            ) : (
              <p className="no-tasks">No tasks for this day.</p>
            )}
          </div>

          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New task title"
            className="task-input"
          />

          <div className="task-meta">
            <span>--:--</span>
            <FaRegClock />
          </div>

          <button className="add-task-btn" onClick={addTask}>
            <FaPlus /> Add Task
          </button>
        </div>
      </div>

      <div className="sidebar-calendar">
        <Calendar className="mini-calendar" />
        <button className="add-task-btn" onClick={togglePanel}>+ Add Task</button>
      </div>

      <TaskPanel show={showPanel} onClose={togglePanel} />
    </div>
  );
};

export default CalendarAndTasks;
