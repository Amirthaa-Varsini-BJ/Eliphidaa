import { useState } from 'react';
import { FaMusic, FaUser, FaFileUpload, FaChartLine, FaSun, FaSignOutAlt } from 'react-icons/fa';

const dropdownItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 12px',
  borderRadius: '8px',
  textDecoration: 'none',
  color: 'var(--text-primary)',
  fontSize: '14px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'left'
};

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleUpload = () => {
    console.log("Upload Notes clicked");
    // Firebase upload logic can go here
  };

  const handleProgress = () => {
    console.log("Progress clicked");
    // Firebase fetch progress logic
  };

  const handleLightMode = () => {
    console.log("Light Mode toggled");
    // Toggle theme logic
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    // Firebase auth signOut logic
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px',
      borderBottom: '1px solid var(--border-color)',
      height: '80px',
      position: 'sticky',
      top: 0,
      backgroundColor: 'var(--bg-primary)',
      zIndex: 10
    }}>
      <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--accent-blue)' }}>Elphida</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: '8px' }}>
          <FaMusic style={{ color: 'var(--accent-orange)' }} />
          <span style={{ fontWeight: 600 }}>5</span>
        </div>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{
            background: 'var(--bg-secondary)',
            width: '40px', height: '40px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FaUser size={18} />
          </button>
          {dropdownOpen && (
            <div style={{
              position: 'absolute', right: 0, top: '50px',
              background: 'var(--bg-secondary)', borderRadius: '12px',
              width: '200px', padding: '8px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 20
            }}>
              <button style={dropdownItemStyle} onClick={handleUpload}><FaFileUpload /> Upload Notes</button>
              <button style={dropdownItemStyle} onClick={handleProgress}><FaChartLine /> Progress</button>
              <button style={dropdownItemStyle} onClick={handleLightMode}><FaSun /> Light Mode</button>
              <div style={{ height: '1px', background: 'var(--border-color)', margin: '8px 0' }}></div>
              <button style={{ ...dropdownItemStyle, color: '#FF5B5B' }} onClick={handleLogout}><FaSignOutAlt /> Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
