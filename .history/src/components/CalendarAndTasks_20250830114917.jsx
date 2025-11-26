import React, { useState } from 'react';
import { FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// ===== Calendar Cell =====
const CalendarCell = ({ date, selectedDate, setSelectedDate }) => {
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isSelected ? '#3b82f6' : '#1f1f1f',
        color: '#fff',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.backgroundColor = '#2b2b2b';
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.backgroundColor = '#1f1f1f';
      }}
    >
      {date.getDate()}
    </div>
  );
};

// ===== Calendar Grid =====
const CalendarGrid = ({ selectedDate, setSelectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDay = startOfMonth.getDay();

  const daysArray = [];
  for (let i = 0; i < firstDay; i++) daysArray.push(null);
  for (let d = 1; d <= endOfMonth.getDate(); d++) {
    daysArray.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), d));
  }

  const prevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Month Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <button onClick={prevMonth} style={{ background: 'transparent', border: 'none', color: '#7c3aed', cursor: 'pointer' }}>
          <FaChevronLeft />
        </button>
        <span style={{ color: '#fff', fontWeight: 600 }}>
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </span>
        <button onClick={nextMonth} style={{ background: 'transparent', border: 'none', color: '#7c3aed', cursor: 'pointer' }}>
          <FaChevronRight />
        </button>
      </div>

      {/* Weekdays */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: 4, color: '#9ca3af', fontWeight: 500 }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
      </div>

      {/* Days */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {daysArray.map((date, idx) => date ? (
          <CalendarCell key={idx} date={date} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        ) : <div key={idx}></div>)}
      </div>
    </div>
  );
};

// ===== Main Component =====
const CalendarAndTasks = ({ addTaskFunction }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: '0 auto', background: '#1f1f1f', borderRadius: 10, color: '#fff' }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#a78bfa' }}>Task Calendar</h2>

      {/* Calendar ABOVE Add Task */}
      <CalendarGrid selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

      {/* Add Task Button */}
      <button
        onClick={addTaskFunction} // keep your original Add Task functionality
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
