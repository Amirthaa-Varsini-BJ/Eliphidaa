import React, { useState, useEffect } from 'react';
import { FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CalendarAndTasks = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState({});
  const [newTask, setNewTask] = useState('');

  // Load tasks from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('tasks');
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  // Save tasks whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const dateKey = selectedDate.toISOString().split('T')[0];
    const updatedTasks = { ...tasks };
    if (!updatedTasks[dateKey]) updatedTasks[dateKey] = [];
    updatedTasks[dateKey].push(newTask.trim());
    setTasks(updatedTasks);
    setNewTask('');
  };

  const selectedDateKey = selectedDate.toISOString().split('T')[0];
  const todaysTasks = tasks[selectedDateKey] || [];

  // Calendar setup
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDay = startOfMonth.getDay();

  const daysArray = [];
  for (let i = 0; i < firstDay; i++) daysArray.push(null);
  for (let d = 1; d <= endOfMonth.getDate(); d++)
    daysArray.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), d));

  const prevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  return (
    <div style={{ background: '#1f1f1f', borderRadius: 10, padding: 16, color: '#fff', maxWidth: 480, margin: '0 auto' }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#a78bfa' }}>Task Calendar</h2>

      {/* Month Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <button onClick={prevMonth} style={{ background: 'transparent', border: 'none', color: '#7c3aed', cursor: 'pointer' }}>
          <FaChevronLeft />
        </button>
        <span>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</span>
        <button onClick={nextMonth} style={{ background: 'transparent', border: 'none', color: '#7c3aed', cursor: 'pointer' }}>
          <FaChevronRight />
        </button>
      </div>

      {/* Weekdays */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: 8, color: '#9ca3af', fontWeight: 500 }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
      </div>

      {/* Days */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 16 }}>
        {daysArray.map((date, idx) => {
          if (!date) return <div key={idx}></div>;
          const isSelected =
            selectedDate.getDate() === date.getDate() &&
            selectedDate.getMonth() === date.getMonth() &&
            selectedDate.getFullYear() === date.getFullYear();

          return (
            <div
              key={idx}
              onClick={() => setSelectedDate(date)}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: isSelected ? '#3b82f6' : '#1f1f1f',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>

      {/* Add Task Input */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="New task"
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 8,
            border: '1px solid #333',
            background: '#1f1f1f',
            color: '#fff',
          }}
        />
        <button
          onClick={addTask}
          style={{
            padding: '0 12px',
            borderRadius: 8,
            background: '#7c3aed',
            color: '#fff',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
            border: 'none',
          }}
        >
          <FaPlus /> Add Task
        </button>
      </div>

      {/* Tasks for selected day */}
      <div style={{ minHeight: 40 }}>
        {todaysTasks.length > 0 ? (
          todaysTasks.map((task, idx) => <p key={idx} style={{ marginBottom: 4 }}>- {task}</p>)
        ) : (
          <p style={{ color: '#9ca3af' }}>No tasks for this day.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarAndTasks;
