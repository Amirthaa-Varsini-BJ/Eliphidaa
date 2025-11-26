import { useState } from 'react';
import Header from './components/Header';
import SemestersSidebar from './components/SemestersSidebar';
import VideoSection from './components/VideoSection';
import NotesSection from './components/NotesSection';
import CalendarAndTasks from './components/CalendarAndTasks';
import StudyRooms from './components/StudyRooms';
import './styles/global.css';

function App() {
  const [selectedSubject, setSelectedSubject] = useState('Core Subject 1A');

  return (
    <>
      <Header />
      <div className="app-container">
        <SemestersSidebar setActiveSubject={setSelectedSubject} />
        <main className="main-content">
          <VideoSection subject={selectedSubject} />
          <NotesSection />
        </main>
        <aside className="right-sidebar">
          <CalendarPage/>
          <StudyRooms />
        </aside>
      </div>
    </>
  );
}

export default App;
