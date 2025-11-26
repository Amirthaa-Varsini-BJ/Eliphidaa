// src/Dashboard.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css'; // Custom CSS for 3D effects

const Dashboard = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [activeSemester, setActiveSemester] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const semesters = [
        { id: 1, name: 'Semester 1', courses: ['Math', 'Physics', 'Chemistry'] },
        { id: 2, name: 'Semester 2', courses: ['Biology', 'History', 'English'] },
        // Add more semesters as needed
    ];

    const toggleProfile = () => setShowProfile(!showProfile);

    const handleSemesterClick = (id) => {
        setActiveSemester(activeSemester === id ? null : id);
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setChatMessages([...chatMessages, newMessage]);
            setNewMessage('');
        }
    };

    return (
        <div className="container-fluid">
            <header className="d-flex justify-content-between align-items-center p-3 bg-light shadow">
                <h1 className="text-primary">Elphida</h1>
                <div className="d-flex align-items-center">
                    <div className="streak-icon me-3">
                        <span role="img" aria-label="streak">🔥</span> 7
                    </div>
                    <button className="btn btn-primary" onClick={toggleProfile}>
                        Profile
                    </button>
                    {showProfile && (
                        <div className="profile-dropdown card">
                            <ul className="list-group">
                                <li className="list-group-item">Upload Notes</li>
                                <li className="list-group-item">Progress</li>
                                <li className="list-group-item">Theme Toggle</li>
                                <li className="list-group-item">Logout</li>
                            </ul>
                        </div>
                    )}
                </div>
            </header>

            <div className="row mt-3">
                <div className="col-2">
                    <div className="semester-bar card">
                        <h5>Semesters</h5>
                        {semesters.map((semester) => (
                            <div key={semester.id}>
                                <button
                                    className="btn btn-light w-100 text-start"
                                    onClick={() => handleSemesterClick(semester.id)}
                                >
                                    {semester.name}
                                </button>
                                {activeSemester === semester.id && (
                                    <ul className="list-group">
                                        {semester.courses.map((course, index) => (
                                            <li key={index} className="list-group-item">{course}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-7">
                    <div className="video-notes card">
                        <h5>YouTube Video</h5>
                        <iframe
                            width="100%"
                            height="315"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                            title="YouTube video"
                            frameBorder="0"
                            allowFullScreen
                        ></iframe>
                        <h5>Handwritten Notes</h5>
                        <p>Notes for the selected course will be displayed here.</p>
                    </div>
                </div>

                <div className="col-3">
                    <div className="calendar-chat card">
                        <h5>Calendar</h5>
                        <p>Add tasks and schedules here.</p>
                        <h5>Chat Room</h5>
                        <div className="chat-window">
                            {chatMessages.map((msg, index) => (
                                <div key={index} className="chat-message">{msg}</div>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="form-control"
                        />
                        <button className="btn btn-primary mt-2" onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
