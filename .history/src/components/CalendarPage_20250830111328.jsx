import { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlus, FaRegClock } from 'react-icons/fa';
import './Calendar.css';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState({});
  const [newTask, setNewTask] = useState('');

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1).getDay();

  // Build calendar days
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const isSelected =
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear();

    calendarDays.push(
      <button
        key={day}
        className={`calendar-day ${isSelected ? 'selected' : ''}`}
        onClick={() => setSelectedDate(new Date(year, currentDate.getMonth(), day))}
      >
        {day}
      </button>
    );
  }

  const changeMonth = (offset) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const dateKey = selectedDate.toISOString().split('T')[0];
    const updated = { ...tasks };
    if (!updated[dateKey]) updated[dateKey] = [];
    updated[dateKey].push(newTask.trim());
    setTasks(updated);
    setNewTask('');
  };

  const selectedDateKey = selectedDate.toISOString().split('T')[0];
  const todaysTasks = tasks[selectedDateKey] || [];

  return (
    <div className="calendar-card">
      <h2 className="calendar-title">Calendar & Tasks</h2>

      {/* Month header */}
      <div className="calendar-header">
        <button onClick={() => changeMonth(-1)}><FaChevronLeft /></button>
        <div>{monthName} {year}</div>
        <button onClick={() => changeMonth(1)}><FaChevronRight /></button>
      </div>

      {/* Week row + grid */}
      <div className="weekdays">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="calendar-grid">{calendarDays}</div>

      {/* Tasks */}
      <h3 className="tasks-heading">Tasks for {selectedDate.toLocaleDateString('en-GB')}</h3>
      <div className="tasks-list">
        {todaysTasks.length > 0
          ? todaysTasks.map((task, i) => <p key={i}>- {task}</p>)
          : <p className="no-tasks">No tasks for this day.</p>}
      </div>

      {/* Input + Add */}
      <input
        type="text"
        className="task-input"
        value={newTask}
        onChange={e => setNewTask(e.target.value)}
        placeholder="New task title"
      />
      <div className="task-meta">
        <span>--:--</span>
        <FaRegClock />
      </div>
      <button className="add-task-btn" onClick={addTask}>
        <FaPlus /> Add Task
      </button>
    </div>
  );
};

export default CalendarPage;
