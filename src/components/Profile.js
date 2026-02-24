import React, { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./profile.css";
import { semestersData, subjectsData } from "../data/subjectData";
import API from "../api";

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

  /* ================= FETCH USER + STREAK ================= */
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("elphiUser"));
    setUser(storedUser);

    const today = new Date();
    const todayStr = today.toDateString();
    const lastVisitStr = localStorage.getItem("lastVisit");
    let currentStreak = parseInt(localStorage.getItem("elphiStreak")) || 0;

    if (!lastVisitStr) {
      currentStreak = 1;
    } else {
      const lastVisit = new Date(lastVisitStr);
      const diffDays = Math.floor(
        (today - lastVisit) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) currentStreak += 1;
      if (diffDays > 1) currentStreak = 1;
    }

    localStorage.setItem("elphiStreak", currentStreak);
    localStorage.setItem("lastVisit", todayStr);
    setStreak(currentStreak);
  }, []);

  /* ================= FETCH NOTES FROM BACKEND ================= */
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await API.get("/notes");
        setNotes(res.data);
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    };

    fetchNotes();
  }, []);

  /* ================= UPLOAD ================= */
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !pdfFile || !selectedSemester || !selectedSubject) {
      alert("Please fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("semester", selectedSemester);
    formData.append("subject", selectedSubject);
    formData.append("pdf", pdfFile);

    try {
      const res = await API.post("/notes", formData);
      setNotes([...notes, res.data]);

      setTitle("");
      setPdfFile(null);
      setSelectedSemester("");
      setSelectedSubject("");
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      await API.delete(`/notes/${id}`);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  /* ================= EDIT ================= */
  const handleSaveEdit = async (id) => {
    try {
      const res = await API.put(`/notes/${id}`, { title: editTitle });

      const updatedNotes = notes.map((note) =>
        note.id === id ? res.data : note
      );

      setNotes(updatedNotes);
      setEditingId(null);
      setEditTitle("");
    } catch (err) {
      console.error("Edit failed:", err);
    }
  };

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