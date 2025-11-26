import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { FaChevronLeft, FaChevronRight, FaPlus, FaRegClock } from 'react-icons/fa';
import 'react-calendar/dist/Calendar.css';

// ===== TaskCell =====
const STATUS_ORDER = ['Not Started', 'In Progress', 'Done'];
const getNextStatus = (current) => STATUS_ORDER[(STATUS_ORDER.indexOf(current) + 1) % STATUS_ORDER.length];

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
    setTasks([...tasks, { name: taskName, status: 'Not Started' }]);
    setTaskName('');
    setShowForm(false);
  };

  const updateStatus = (index) => {
    const newTasks = [...tasks];
    newTasks[index].status = getNextStatus(newTasks[index].status);
    setTasks(newTasks);
  };

  return (
    <div style={{ border: '1px solid #333', padding: 4, borderRadius: 6, marginBottom: 4, background: '#1f1f1f', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span>{date.getDate()}</span>
        {!showForm && <button style={{ background: 'transparent', border: 'none', color: '#7c3aed', cursor: 'pointer' }} onClick={() => setShowForm(true)}>+</button>}
      </div>

      {tasks.map((task, idx) => (
        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: 2, marginBottom: 2, background: '#2b2b2b', borderRadius: 4 }}>
          <span>{task.name}</span>
          <span onClick={() => updateStatus(idx)} style={{ cursor: 'pointer', padding: '0 4px', borderRadius: 4, background: '#7c3aed', fontSize: 12 }}>
            {task.status}
          </span>
        </div>
      ))}

      {showForm && (
        <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
          <input
            type="text"
            value={taskName}
            placeholder="Task name"
            onChange={(e) => setTaskName(e.target.value)}
            style={{ flex: 1, padding: 4, borderRadius: 4, border: '1px solid #333', background: '#181818', color: '#fff' }}
          />
          <button onClick={addTask} style={{ padding: '4px 8px', borderRadius: 4, background: '#7c3aed', color: '#fff', border: 'none', cursor: 'pointer' }}>✔</button>
        </div>
      )}
    </div>
  );
};

// ===== TaskPanel =====
const TaskPanel = ({ show, onClose }) => {
  const generateCalendarGrid = () => {
    const today = new Date();
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const days = [];
    for (let i = 1; i <= end.getDate(); i++) {
      const date = new Date(today.getFullYear(), today.getMonth(), i);
      days.push(<TaskCell key={i} date={date} />);
    }
    return days;
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: show ? 'rgba(0,0,0,0.7)' : 'transparent', display: show ? 'block' : 'none',
      zIndex: 9999, overflowY: 'auto', padding: 20
    }}>
      <div style={{ background: '#1f1f1f', borderRadius: 10, padding: 20, maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <h3 style={{ color: '#fff' }}>Task Calendar</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: 24, color: '#fff', cursor: 'pointer' }}>×</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
          {generateCalendarGrid()}
        </div>
      </div>
    </div>
  );
};

// ===== Main CalendarAndTasks =====
const CalendarAndTasks = () => {
  const [showPanel, setShowPanel] = useState(false);
  const togglePanel = () => setShowPanel(!showPanel);

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
        style={{
          width: 36, height: 36, borderRadius: '50%',
          background: isSelected ? '#3b82f6' : 'transparent',
          color: '#fff', fontWeight: isSelected ? 600 : 400,
          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 20 }}>
      {/* Mini Calendar + tasks */}
      <div style={{ background: '#1f1f1f', borderRadius: 10, padding: 16, color: '#fff' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#a78bfa' }}>Mini Calendar & Tasks</h2>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <button onClick={() => changeMonth(-1)} style={{ background: 'transparent', border: 'none', color: '#fff' }}><FaChevronLeft /></button>
          <div style={{ fontWeight: 600 }}>{monthName} {year}</div>
          <button onClick={() => changeMonth(1)} style={{ background: 'transparent', border: 'none', color: '#fff' }}><FaChevronRight /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 8, textAlign: 'center', fontSize: 14, color: '#9ca3af', fontWeight: 500 }}>
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 16 }}>{calendarDays}</div>

        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Tasks for {selectedDate.toLocaleDateString('en-GB')}</h3>
        <div style={{ marginBottom: 12, minHeight: 40 }}>
          {todaysTasks.length > 0 ? todaysTasks.map((task, idx) => <p key={idx}>- {task}</p>) : <p style={{ color: '#9ca3af' }}>No tasks for this day.</p>}
        </div>

        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task title"
          style={{ width: '100%', padding: 10, borderRadius: 8, background: '#181818', border: '1px solid #333', color: '#fff', marginBottom: 10 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#9ca3af', fontSize: 13, marginBottom: 10 }}>
          <span>--:--</span><FaRegClock />
        </div>
        <button onClick={addTask} style={{ width: '100%', padding: 12, borderRadius: 8, background: '#7c3aed', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <FaPlus /> Add Task
        </button>
      </div>

      {/* Sidebar calendar */}
      <div>
        <Calendar />
        <button onClick={togglePanel} style={{ marginTop: 10, padding: 12, borderRadius: 8, background: '#7c3aed', color: '#fff', fontWeight: 600 }}>+ Add Task</button>
      </div>

      <TaskPanel show={showPanel} onClose={togglePanel} />
    </div>
  );
};

export default CalendarAndTasks;
