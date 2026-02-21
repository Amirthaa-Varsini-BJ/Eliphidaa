import React, { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./profile.css";
const Profile = () => {
  const [streak, setStreak] = useState(0);
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("elphiUser"));
    setUser(storedUser);

    const today = new Date();
    const todayStr = today.toDateString();

    const lastVisitStr = localStorage.getItem("lastVisit");
    let currentStreak = parseInt(localStorage.getItem("elphiStreak")) || 0;

    if (!lastVisitStr) {
      currentStreak = 1;
      localStorage.setItem("elphiStreak", 1);
      localStorage.setItem("lastVisit", todayStr);
    } else {
      const lastVisit = new Date(lastVisitStr);
      const diffDays = Math.floor(
        (today - lastVisit) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        currentStreak += 1;
        localStorage.setItem("elphiStreak", currentStreak);
        localStorage.setItem("lastVisit", todayStr);
      } else if (diffDays > 1) {
        currentStreak = 1;
        localStorage.setItem("elphiStreak", 1);
        localStorage.setItem("lastVisit", todayStr);
      }
    }

    setStreak(currentStreak);

    const storedNotes = JSON.parse(localStorage.getItem("elphiNotes"));
    setNotes(storedNotes || []);
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-card">

        <div className="profile-header">
          <i className="bi bi-person-circle profile-icon"></i>
          <h2>{user?.name || "Student"}</h2>
          <p>{user?.email}</p>
        </div>

        <div className="profile-stats">
          <div className="stat-box">
            <i className="bi bi-fire"></i>
            <h3 className="streak-fire">{streak}</h3>
            <p>Day Streak</p>
          </div>

          <div className="stat-box">
            <i className="bi bi-journal-text"></i>
            <h3>{notes.length}</h3>
            <p>Uploaded Notes</p>
          </div>
        </div>

        <div className="notes-section">
          <h4>My Uploaded Notes</h4>

          {notes.length === 0 ? (
            <p className="empty">No notes uploaded yet.</p>
          ) : (
            <ul>
              {notes.map((note, index) => (
                <li key={index}>
                  <i className="bi bi-file-earmark-text"></i>
                  {note.title}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;