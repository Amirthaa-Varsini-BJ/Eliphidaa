import { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlus, FaRegClock } from 'react-icons/fa';

const CalendarAndTasks = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 5));
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 6, 5));
  const [tasks, setTasks] = useState({});
  const [newTask, setNewTask] = useState('');

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`}></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const isSelected = selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear();

    calendarDays.push(
      <button
        key={day}
        onClick={() => setSelectedDate(new Date(year, currentDate.getMonth(), day))}
        style={{
          width: '36px', height: '36px', borderRadius: '50%',
          backgroundColor: isSelected ? 'var(--accent-blue)' : 'transparent',
          color: isSelected ? 'var(--text-primary)' : 'var(--text-primary)',
          fontWeight: isSelected ? 600 : 400,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={e => !isSelected && (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
        onMouseLeave={e => !isSelected && (e.currentTarget.style.backgroundColor = 'transparent')}
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
    const updatedTasks = { ...tasks };
    if (!updatedTasks[dateKey]) updatedTasks[dateKey] = [];
    updatedTasks[dateKey].push(newTask.trim());
    setTasks(updatedTasks);
    setNewTask('');
  };

  const selectedDateKey = selectedDate.toISOString().split('T')[0];
  const todaysTasks = tasks[selectedDateKey] || [];

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--accent-purple)' }}>Calendar & Tasks</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button onClick={() => changeMonth(-1)} style={{ padding: '8px' }}><FaChevronLeft /></button>
        <div style={{ fontWeight: 600, fontSize: '16px' }}>{monthName} {year}</div>
        <button onClick={() => changeMonth(1)} style={{ padding: '8px' }}><FaChevronRight /></button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '16px', textAlign: 'center' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>{day}</div>
        ))}
        {calendarDays}
      </div>

      <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>
        Tasks for {selectedDate.toLocaleDateString('en-GB')}
      </h3>

      <div style={{ marginBottom: '16px', minHeight: '40px' }}>
        {todaysTasks.length > 0 ? (
          todaysTasks.map((task, index) => (
            <p key={index} style={{ marginBottom: '4px' }}>- {task}</p>
          ))
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>No tasks for this day.</p>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task title"
          style={{
            width: '100%', padding: '12px', borderRadius: '8px',
            background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
            color: 'var(--text-primary)'
          }}
        />
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', color: 'var(--text-secondary)', padding: '0 4px', fontSize: '14px'
        }}>
          <span>--:--</span>
          <FaRegClock />
        </div>
        <button
          onClick={addTask}
          style={{
            width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--accent-purple)',
            color: 'var(--text-primary)', fontWeight: 600, display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px', transition: 'opacity 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <FaPlus /> Add Task
        </button>
      </div>
    </div>
  );
};

export default CalendarAndTasks;
