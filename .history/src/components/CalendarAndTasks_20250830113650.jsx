import React, { useState } from 'react';
import { FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const STATUS_ORDER = ['Not Started', 'In Progress', 'Done'];
const getNextStatus = (current) =>
  STATUS_ORDER[(STATUS_ORDER.indexOf(current) + 1) % STATUS_ORDER.length];

const TaskCell = ({ date, selectedDate, setSelectedDate }) => {
  const storageKey = `tasks-${date.toDateString()}`;
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  const addTask = (name) => {
    const newTasks = [...tasks, { name, status: 'Not Started' }];
    setTasks(newTasks);
    localStorage.setItem(storageKey, JSON.stringify(newTasks));
  };

  const updateStatus = (index) => {
    const newTasks = [...tasks];
    newTasks[index].status = getNextStatus(newTasks[index].status);
    setTasks(newTasks);
    localStorage.setItem(storageKey, JSON.stringify(newTasks));
  };

  const isSelected =
    selectedDate.getDate() === date.getDate() &&
    selectedDate.getMonth() === date.getMonth() &&
    selectedDate.getFullYear() === date.getFullYear();

  return (
    <div
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
};

const CalendarAndTasks = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDay = startOfMonth.getDay();

  const daysArray = [];
  for (let i = 0; i < firstDay; i++) daysArray.push(null);
  for (let d = 1; d <= endOfMonth.getDate(); d++)
    daysArray.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), d));

  const prevMonth = () => setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  return (
    <div
      style={{
        background: '#1f1f1f',
        borderRadius: 10,
        padding: 16,
        color: '#fff',
        maxWidth: 400,
        margin: '0 auto',
      }}
    >
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#a78bfa' }}>
        Task Calendar
      </h2>

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
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <div key={day}>{day}</div>)}
      </div>

      {/* Days */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 16 }}>
        {daysArray.map((date, idx) =>
          date ? <TaskCell key={idx} date={date} selectedDate={selectedDate} setSelectedDate={setSelectedDate} /> : <div key={idx}></div>
        )}
      </div>

      {/* Add Task Button */}
      <button
        style={{
          width: '100%',
          padding: 12,
          borderRadius: 8,
          background: '#7c3aed',
          color: '#fff',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          cursor: 'pointer',
          border: 'none',
        }}
      >
        <FaPlus /> Add Task
      </button>
    </div>
  );
};

export default CalendarAndTasks;
