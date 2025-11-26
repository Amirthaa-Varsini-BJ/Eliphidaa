import React from 'react';
import './Calendar.css';
import TaskCell from './TaskCell';

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

export default TaskPanel;
