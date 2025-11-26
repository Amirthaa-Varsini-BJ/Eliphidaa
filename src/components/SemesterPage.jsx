import { useState } from 'react';
import SemestersSidebar from './SemestersSidebar';  // Make sure path is correct
import VideoSection from './VideoSection';          // Make sure path is correct

const SemesterPage = () => {
  const [selectedSubject, setSelectedSubject] = useState('Core Subject 1A');

  return (
    <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      {/* Sidebar */}
      <div style={{ flex: '1 1 250px', minWidth: '240px' }}>
        <SemestersSidebar setActiveSubject={setSelectedSubject} />
      </div>

      {/* Video Section */}
      <div style={{ flex: '3 1 500px', minWidth: '300px' }}>
        <VideoSection subject={selectedSubject} />
      </div>
    </div>
  );
};

export default SemesterPage;
