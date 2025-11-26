import React, { useState, useEffect } from 'react';
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
  const [showForm, setShowForm] = useState(false);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  }, [tasks, storageKey]);

  const addTask = () => {
    if (!taskName.trim()) return;
    const newTasks = [...tasks, { name: taskName, status: 'Not Started' }];
    setTasks(newTasks);
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
          marginBottom: 4,
        }}
      >
        {date.getDate()}
      </div>

      {/* Inline task form for selected date */}
      {isSelected && (
        <div style={{ width: 120 }}>
          {tasks.map((task, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: 12,
                background: '#2b2b2b',
                padding: '2px 4px',
                borderRadius: 4,
                marginBottom: 2,
                cursor: 'pointer',
              }}
              onClick={() => updateStatus(idx)}
              title="Click to change status"
            >
              <span>{task.name}</span>
              <span
                style={{
                  background:
                    task.status === 'Not Started'
                      ? '#f87171'
                      : task.status === 'In Progress'
                      ? '#facc15'
                      : '#34d399',
                  color: '#000',
                  padding: '0 4px',
                  borderRadius: 4,
                  fontSize: 10,
                }}
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
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Task"
                style={{
                  flex: 1,
                  padding: 4,
                  fontSize: 12,
                  borderRadius: 4,
                  border: '1px solid #333',
                  background: '#1f1f1f',
                  color: '#fff',
                }}
              />
              <button
                onClick={addTask}
                style={{
                  background: '#7c3aed',
                  border: 'none',
                  borderRadius: 4,
                  color: '#fff',
                  padding: '2px 6px',
                  cursor: 'pointer',
                }}
              >
                ✔
              </button>
            </div>
          )}

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              style={{
                marginTop: 4,
                background: '#7c3aed',
                border: 'none',
                borderRadius: 4,
                color: '#fff',
                padding: '2px 6px',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              + Add
            </button>
          )}
        </div>
      )}
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
        maxWidth: 480,
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
