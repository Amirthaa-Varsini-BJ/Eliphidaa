import React, { useState } from 'react';
import Calendar from 'react-calendar';
import TaskPanel from './TaskPanel';
import './Calendar.css';
import 'react-calendar/dist/Calendar.css';

const CalendarPage = () => {
  const [showPanel, setShowPanel] = useState(false);
  const togglePanel = () => setShowPanel(!showPanel);

  return (
    <div className="calendar-page">
      <div className="main-content">
        {/* Other content here */}
      
      </div>

      <div className="sidebar-calendar">
        <Calendar className="mini-calendar" />
        <button className="add-task-btn" onClick={togglePanel}>
          + Add Task
        </button>
      </div>

      <TaskPanel show={showPanel} onClose={togglePanel} />
    </div>
  );
};

export default CalendarPage;
