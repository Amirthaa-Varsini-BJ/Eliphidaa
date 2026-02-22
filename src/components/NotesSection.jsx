import { useEffect, useState } from "react";
import NoteCard from "./NoteCard";

const NotesSection = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("elphiNotes"));
    setNotes(stored || []);
  }, []);

  return (
    <div>
      <h2>Handwritten Notes & Materials</h2>

      <div className="notes-grid">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
};

export default NotesSection;