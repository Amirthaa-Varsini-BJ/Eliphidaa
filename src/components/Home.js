import React from 'react';
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Elphida Home (Simplified for Debug)</h1>
      <p>If you see this, the Home component works.</p>
      <div style={{ marginTop: "20px" }}>
        <Link to="/login" style={{ marginRight: "20px", padding: "10px 20px", background: "#4A6FFF", color: "white", textDecoration: "none", borderRadius: "5px" }}>Login</Link>
        <Link to="/signup" style={{ padding: "10px 20px", background: "#9055FF", color: "white", textDecoration: "none", borderRadius: "5px" }}>Sign Up</Link>
      </div>
    </div>
  );
};

export default Home;
