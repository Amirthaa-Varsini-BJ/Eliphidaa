import NoteCard from './NoteCard';

const NotesSection = () => {
  
   const notes = [
  {
    id: 1,
    title: "Comprehensive Notes - Part 1",
    fileUrl: "/uploads/notes1.pdf",   // PDF file
    thumbnail: "/uploads/notes1_thumb.jpg", // preview of page 1
    rating: 4.7,
    count: 140,
    submitter: "StudiousStudent"
  },
  {
    id: 2,
    title: "Comprehensive Notes - Part 2",
    fileUrl: "/uploads/notes2.pdf",
    thumbnail: "/uploads/notes2_thumb.jpg",
    rating: 3.7,
    count: 115,
    submitter: "KnowledgeSeeker"
  }
];


  return (
    <div>
      <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Handwritten Notes & Materials</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {notes.map(note => <NoteCard key={note.id} note={note} />)}
      </div>
    </div>
  );
};

export default NotesSection;
