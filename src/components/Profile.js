import React, { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./profile.css";
import { semestersData, subjectsData } from "../data/subjectData";

const Profile = () => {
  const [streak, setStreak] = useState(0);
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);
const [editingId, setEditingId] = useState(null);
const [editTitle, setEditTitle] = useState("");
  const [title, setTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

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
const handleDelete = (id) => {
  const updatedNotes = notes.filter((note) => note.id !== id);
  setNotes(updatedNotes);
  localStorage.setItem("elphiNotes", JSON.stringify(updatedNotes));
};
const handleSaveEdit = (id) => {
  const updatedNotes = notes.map((note) =>
    note.id === id ? { ...note, title: editTitle } : note
  );

  setNotes(updatedNotes);
  localStorage.setItem("elphiNotes", JSON.stringify(updatedNotes));
  setEditingId(null);
  setEditTitle("");
};
  const handleUpload = (e) => {
    e.preventDefault();

    if (!title || !pdfFile || !selectedSemester || !selectedSubject) {
      alert("Please fill all fields");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const newNote = {
        id: Date.now(),
        title,
        fileUrl: reader.result,
        semester: selectedSemester,
        subject: selectedSubject,
      };

      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      localStorage.setItem("elphiNotes", JSON.stringify(updatedNotes));

      setTitle("");
      setPdfFile(null);
      setSelectedSemester("");
      setSelectedSubject("");
    };

    reader.readAsDataURL(pdfFile);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">

        {/* HEADER */}
        <div className="profile-header">
          <i className="bi bi-person-circle profile-icon"></i>
          <h2>{user?.name || "Student"}</h2>
          <p>{user?.email}</p>
        </div>

        {/* STATS */}
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

        {/* UPLOAD SECTION */}
        <div className="themed-card">
          <h4>Upload New Note</h4>
          <form onSubmit={handleUpload} className="upload-form">

            <select
  value={selectedSemester}
  onChange={(e) => setSelectedSemester(e.target.value)}
>
  <option value="">Select Semester</option>
  {semestersData.map((sem) => (
    <option key={sem.id} value={sem.id}>
      {sem.name}
    </option>
  ))}
</select>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={!selectedSemester}
            >
              <option value="">Select Subject</option>
              {subjectsData
                .filter((sub) => sub.semesterId === selectedSemester)
                .map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
            </select>

            <input
              type="text"
              placeholder="Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
            />

            <button type="submit" className="themed-button">
              Upload Note
            </button>
          </form>
        </div>

        {/* OLD NOTES LIST (UNCHANGED FEATURE) */}
        <div className="notes-section">
          <h4>My Uploaded Notes</h4>

          {notes.length === 0 ? (
            <p className="empty">No notes uploaded yet.</p>
          ) : (
           <ul>
  {notes.map((note) => (
    <li key={note.id} className="note-item">
      <i className="bi bi-file-earmark-text"></i>

      {editingId === note.id ? (
        <>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <button onClick={() => handleSaveEdit(note.id)}>
            Save
          </button>
        </>
      ) : (
        <>
          <span>
            {note.title} ({note.subject})
          </span>

          <button
            onClick={() => {
              setEditingId(note.id);
              setEditTitle(note.title);
            }}
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(note.id)}
            style={{ marginLeft: "8px", color: "red" }}
          >
            Delete
          </button>
        </>
      )}
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