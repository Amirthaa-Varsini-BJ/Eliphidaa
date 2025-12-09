import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Example Dropdown */}
      <div className="dropdown">
        <button onClick={() => navigate("/upload")}>Upload Notes</button>
        <button onClick={() => navigate("/progress")}>Progress</button>
        <button>Light Mode</button>
        <button>Logout</button>
      </div>

      {/* Rest of your dashboard */}
    </div>
  );
}

export default Dashboard;
