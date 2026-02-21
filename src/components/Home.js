import React, { useEffect, useRef } from 'react';
import './Home.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { darkMode, toggleTheme } = useTheme();
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    gsap.set([aboutRef.current, contactRef.current], { opacity: 0, y: 50 });

    gsap.to(aboutRef.current, {
      scrollTrigger: {
        trigger: aboutRef.current,
        start: 'top 85%',
      },
      opacity: 1,
      y: 0,
      duration: 1,
    });

    gsap.to(contactRef.current, {
      scrollTrigger: {
        trigger: contactRef.current,
        start: 'top 85%',
      },
      opacity: 1,
      y: 0,
      duration: 1,
    });
  }, []);

  return (
    <div className={darkMode ? 'dark-mode' : 'light-mode'}>
     <nav className="navbar">
  <h2 className="logo">Elphida</h2>

  <div className="nav-right">
    <Link to="/login" className="nav-link">Login</Link>
    <Link to="/signup" className="nav-link signup-btn">Sign Up</Link>

    <button onClick={toggleTheme} className="theme-toggle">
      {darkMode ? "🌙" : "☀️"}
    </button>
  </div>
</nav>

      <div className="hero-video-wrapper">
        <video autoPlay muted loop playsInline className="full-video">
          <source src="/video.mp4" type="video/mp4" />
        </video>
      </div>

      <section id="about" className="content-section" ref={aboutRef}>
        <h2>About Elphida</h2>
        <p>
          Elphida is a modern e-learning platform designed to provide engaging,
          interactive, and accessible education to students around the globe.
        </p>
      </section>

      <section id="contact" className="content-section" ref={contactRef}>
        <h2>Contact Us</h2>
        <p>
          Email: <a href="mailto:info@elphida.com">info@elphida.com</a><br />
          Phone: +1 (123) 456-7890
        </p>
      </section>
    </div>
  );
};

export default Home;
