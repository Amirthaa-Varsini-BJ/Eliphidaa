import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./Progress.css";

function Progress() {
  const [progress] = useState({
    lecturesCompleted: 10,
    notesDownloaded: 5,
  });

  const totalLectures = 20;
  const totalNotes = 10;

  const data = [
    { name: "Lectures Completed", value: progress.lecturesCompleted },
    { name: "Remaining Lectures", value: totalLectures - progress.lecturesCompleted },
    { name: "Notes Downloaded", value: progress.notesDownloaded },
    { name: "Remaining Notes", value: totalNotes - progress.notesDownloaded },
  ];

  const COLORS = ["#00C49F", "#FF8042", "#0088FE", "#FFBB28"];

  return (
    <div className="progress-container">
      <h2>Your Progress</h2>
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default Progress;
