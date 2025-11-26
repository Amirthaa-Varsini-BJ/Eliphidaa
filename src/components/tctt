import { FaPlus, FaPaperPlane } from 'react-icons/fa';

const StudyRooms = () => (
  <div className="card">
    <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--accent-blue)' }}>Study Rooms</h2>

    <button style={{
      width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--accent-blue)',
      color: 'var(--text-primary)', fontWeight: 600, display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: '8px', marginBottom: '16px', transition: 'opacity 0.2s'
    }}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
    >
      <FaPlus /> Add New Room
    </button>

    <div style={{ display: 'flex', gap: '8px' }}>
      <input
        type="text"
        placeholder="Enter Room ID"
        style={{
          flexGrow: 1, padding: '12px', borderRadius: '8px', background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)', color: 'var(--text-primary)'
        }}
      />
      <button style={{
        padding: '0 16px', borderRadius: '8px', background: 'var(--accent-purple)',
        color: 'var(--text-primary)', fontWeight: 600, transition: 'opacity 0.2s'
      }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        <FaPaperPlane />
      </button>
    </div>

    <p style={{
      marginTop: '16px', padding: '16px', textAlign: 'center', color: 'var(--text-secondary)',
      background: 'var(--bg-primary)', borderRadius: '8px', fontSize: '14px'
    }}>
      Join or create a room to start chatting.
    </p>
  </div>
);

export default StudyRooms;
