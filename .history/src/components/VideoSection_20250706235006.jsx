import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import StarRating from './StarRating'; 
import { jsPDF } from 'jspdf';


const VideoSection = ({ subject = 'Core Subject 1A' }) => {
  const [videoData, setVideoData] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleStart, setVisibleStart] = useState(0);

  const videos = videoData[subject] || [];

  useEffect(() => {
    fetch('/videos.json')
      .then((res) => res.json())
      .then((data) => setVideoData(data))
      .catch((err) => console.error('Failed to load videos.json:', err));
  }, []);

  useEffect(() => {
    setActiveIndex(0);
    setVisibleStart(0);
  }, [subject]);
  const [noteText, setNoteText] = useState('');

const getStorageKey = (subject, title) => `notes-${subject}-${title}`;

useEffect(() => {
  const activeVideo = videos[activeIndex];
  if (activeVideo) {
    const savedNote = localStorage.getItem(getStorageKey(subject, activeVideo.title));
    setNoteText(savedNote || '');
  }
}, [subject, activeIndex]);

const handleNoteChange = (e) => {
  const value = e.target.value;
  setNoteText(value);
  const activeVideo = videos[activeIndex];
  if (activeVideo) {
    localStorage.setItem(getStorageKey(subject, activeVideo.title), value);
  }
};


  const handleNextSlide = () => {
    if (visibleStart + 3 < videos.length) setVisibleStart(prev => prev + 1);
  };

  const handlePrevSlide = () => {
    if (visibleStart > 0) setVisibleStart(prev => prev - 1);
  };
  const handleDownloadPDF = () => {
  const doc = new jsPDF();
  const activeVideo = videos[activeIndex];
  const filename = `${subject} - ${activeVideo?.title || 'notes'}.pdf`;

  doc.setFontSize(14);
  doc.text(`Subject: ${subject}`, 10, 10);
  doc.text(`Topic: ${activeVideo?.title}`, 10, 20);
  doc.setFontSize(12);
  doc.text(noteText || 'No notes available.', 10, 30, { maxWidth: 180 });
  doc.save(filename);
};


  const activeVideo = videos[activeIndex];

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>{subject} - Video Lectures</h2>

      {/* Active Video */}
      <div style={{
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
        marginBottom: '24px',
        background: '#000',
        aspectRatio: '16 / 9',
      }}>
        {activeVideo ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${activeVideo.youtubeId}`}
            title={activeVideo.title}
            frameBorder="0"
            allowFullScreen
            style={{ width: '100%', height: '100%' }}
            
          />
          
        ) : (
          <div style={{ padding: '24px', color: 'var(--text-secondary)' }}>No videos available</div>
        )}
      </div>
      {/* Notes Section */}
{activeVideo && (
  <div style={{ marginTop: '16px' }}>
    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
      Notes for: {activeVideo.title}
    </h3>
    <textarea
      placeholder="Write your thoughts here..."
      value={noteText}
      onChange={handleNoteChange}
      style={{
        width: '100%',
        minHeight: '120px',
        background: 'var(--bg-tertiary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '12px',
        fontSize: '14px',
        resize: 'vertical',
      }}
    />
    
    <button
  onClick={handleDownloadPDF}
  style={{
    marginTop: '12px',
    padding: '8px 16px',
    backgroundColor: 'var(--accent-blue)',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '14px',
  }}
>
  Download Notes as PDF
</button>

  </div>
)}


      {/* Playlist Slider */}
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Next Topics</h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          {/* Left Button */}
          <button
            onClick={handlePrevSlide}
            disabled={visibleStart === 0}
            style={{
              background: 'var(--bg-tertiary)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              color: 'white',
              opacity: visibleStart === 0 ? 0.4 : 1,
            }}
          >
            <FaChevronLeft />
          </button>

          {/* Video Thumbnails */}
          <div style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'hidden',
          }}>
            {videos.slice(visibleStart, visibleStart + 3).map((video, index) => {
              const absoluteIndex = visibleStart + index;
              const isActive = absoluteIndex === activeIndex;
              return (
                <div
                  key={video.title}
                  onClick={() => setActiveIndex(absoluteIndex)}
                  style={{
                    minWidth: '180px',
                    cursor: 'pointer',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isActive
                      ? '0 6px 16px rgba(0,0,0,0.2)'
                      : '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease-in-out',
                    backgroundColor: 'black',
                  }}
                >
                  <iframe
                    width="100%"
                    height="100"
                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ pointerEvents: 'none' }} // Prevent mini iframes from being clickable
                  />
                  <div style={{
                    padding: '8px',
                    fontSize: '13px',
                    color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    backgroundColor: 'var(--bg-secondary)',
                    textAlign: 'center',
                  }}>
                    {video.title}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Button */}
          <button
            onClick={handleNextSlide}
            disabled={visibleStart + 3 >= videos.length}
            style={{
              background: 'var(--bg-tertiary)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              color: 'white',
              opacity: visibleStart + 3 >= videos.length ? 0.4 : 1,
            }}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
