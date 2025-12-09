import { useState } from "react";
import "./UploadNotes.css";

function UploadNotes() {
  const [form, setForm] = useState({
    name: "",
    semester: "",
    subject: "",
    file: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    alert("Notes uploaded successfully!");
  };

  return (
    <div className="upload-container">
      <h2>Upload Notes</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />

        <label>Semester</label>
        <select name="semester" value={form.semester} onChange={handleChange} required>
          <option value="">Select Semester</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
          <option value="3">Semester 3</option>
          <option value="4">Semester 4</option>
          <option value="5">Semester 5</option>
          <option value="6">Semester 6</option>
          <option value="7">Semester 7</option>
          <option value="8">Semester 8</option>
        </select>

        <label>Subject</label>
        <input type="text" name="subject" value={form.subject} onChange={handleChange} required />

        <label>Upload File</label>
        <input type="file" name="file" onChange={handleChange} required />

        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default UploadNotes;
