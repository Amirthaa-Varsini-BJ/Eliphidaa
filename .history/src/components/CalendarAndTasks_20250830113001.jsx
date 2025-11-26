import React, { useState, useEffect } from 'react';
import { FaPlus, FaRegClock } from 'react-icons/fa';

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

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: '#1f1f1f', borderRadius: 10, padding: 16, color: '#fff', maxWidth: 400 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#a78bfa' }}>Task Calendar</h2>
        <button onClick={togglePanel} style={{ width: '100%', padding: 12, borderRadius: 8, background: '#7c3aed', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <FaPlus /> Open Calendar
        </button>
      </div>

      <TaskPanel show={showPanel} onClose={togglePanel} />
    </div>
  );
};

export default CalendarAndTasks;
