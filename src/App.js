import { useState } from 'react';
import Header from './components/Header';
import SemestersSidebar from './components/SemestersSidebar';
import VideoSection from './components/VideoSection';
import NotesSection from './components/NotesSection';
import CalendarAndTasks from './components/CalendarAndTasks';
import StudyRooms from './components/StudyRooms';
import Login from './components/Login';
import Signup from './components/Signup';
import CalendarPage from './components/CalendarPage';
import ElphiChatWidget from './components/ElphiChatWidget';
import './styles/global.css';

import ElphiChatWidget from './components/ElphiChatWidget';

function App() {
  return (
    <>
      <Header />
      <div className="app-container">
        <SemestersSidebar />
        <main className="main-content">
          <VideoSection />
          <NotesSection />
        </main>
        <aside className="right-sidebar">
          <CalendarAndTasks />
          <StudyRooms />
        </aside>
      </div>

      {/* Bot always at bottom */}
      <ElphiChatWidget />
    </>
  );
}


export default App;
