import React, { useState, useEffect } from 'react';
import { FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// ===== TaskCell =====
const STATUS_ORDER = ['Not Started', 'In Progress', 'Done'];
const getNextStatus = (current) =>
  STATUS_ORDER[(STATUS_ORDER.indexOf(current) + 1) % STATUS_ORDER.length];

const TaskCell = ({ date, selectedDate, setSelectedDate }) => {
  const storageKey = `tasks-${date.toDateString()}`;
  const [showForm, setShowForm] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to parse tasks from storage', err);
        setTasks([]);
      }
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(tasks));
    } catch (err) {
      console.error('Failed to save tasks', err);
    }
  }, [tasks, storageKey]);

  const addTask = () => {
    if (!taskName.trim()) return;
    setTasks([...tasks, { name: taskName.trim(), status: 'Not Started' }]);
    setTaskName('');
    setShowForm(false);
  };

  const updateStatus = (index) => {
    const newTasks = [...tasks];
    newTasks[index].status = getNextStatus(newTasks[index].status);
    setTasks(newTasks);
  };

  const isSelected =
    selectedDate.getDate() === date.getDate() &&
    selectedDate.getMonth() === date.getMonth() &&
    selectedDate.getFullYear() === date.getFullYear();

  return (
    <div
      style={{
        border: '1px solid #333',
        padding: 4,
        borderRadius: 6,
        marginBottom: 4,
        background: isSelected ? '#3b82f6' : '#1f1f1f',
        color: '#fff',
        cursor: 'pointer',
      }}
      onClick={() => setSelectedDate(date)}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.backgroundColor = '#2b2b2b';
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.backgroundColor = '#1f1f1f';
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        }}
      >
        <span>{date.getDate()}</span>
        {!showForm && (
          <button
            style={{
              background: 'transparent',
              border: 'none',
              color: '#7c3aed',
              cursor: 'pointer',
            }}
            onClick={(e) => {
              e.stopPropagation();
              setShowForm(true);
            }}
          >
            +
          </button>
        )}
      </div>

      {tasks.map((task, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: 2,
            marginBottom: 2,
            background: '#2b2b2b',
            borderRadius: 4,
          }}
        >
          <span>{task.name}</span>
          <span
            onClick={() => updateStatus(idx)}
            style={{
              cursor: 'pointer',
              padding: '0 4px',
              borderRadius: 4,
              background: '#7c3aed',
              fontSize: 12,
            }}
            title="Click to change status"
          >
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
            style={{
              flex: 1,
              padding: 4,
              borderRadius: 4,
              border: '1px solid #333',
              background: '#181818',
              color: '#fff',
            }}
          />
          <button
            onClick={addTask}
            style={{
              padding: '4px 8px',
              borderRadius: 4,
              background: '#7c3aed',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ✔
          </button>
        </div>
      )}
    </div>
  );
};

// ===== CalendarPanel =====
const CalendarPanel = ({ show, onClose, selectedDate, setSelectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDay = startOfMonth.getDay();

  const daysArray = [];
  for (let i = 0; i < firstDay; i++) daysArray.push(null);
  for (let d = 1; d <= endOfMonth.getDate(); d++) {
    daysArray.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), d));
  }

  const prevMonth = () => setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: show ? 'rgba(0,0,0,0.7)' : 'transparent',
        display: show ? 'block' : 'none',
        zIndex: 9999,
        overflowY: 'auto',
        padding: 20,
      }}
    >
      <div
        style={{
          background: '#1f1f1f',
          borderRadius: 10,
          padding: 20,
          maxWidth: 800,
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <h3 style={{ color: '#fff' }}>{monthName} {year}</h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 24,
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        {/* Month navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <button
            onClick={prevMonth}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#7c3aed',
              cursor: 'pointer',
              fontSize: 18,
            }}
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={nextMonth}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#7c3aed',
              cursor: 'pointer',
              fontSize: 18,
            }}
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Weekdays */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            textAlign: 'center',
            marginBottom: 8,
            color: '#9ca3af',
            fontWeight: 500,
          }}
        >
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Days */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 6,
            marginBottom: 16,
          }}
        >
          {daysArray.map((date, idx) =>
            date ? (
              <TaskCell
                key={idx}
                date={date}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            ) : (
              <div key={idx}></div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

// ===== Main Component =====
const CalendarAndTasks = () => {
  const [showPanel, setShowPanel] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const togglePanel = () => setShowPanel(!showPanel);

  return (
    <div style={{ padding: 20 }}>
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

        {/* Calendar Grid ABOVE Add Task */}
        <CalendarPanel
          show={showPanel}
          onClose={togglePanel}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <button
          onClick={togglePanel}
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
    </div>
  );
};

export default CalendarAndTasks;
