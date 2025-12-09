import React, { useEffect, useRef } from 'react';
import './Home.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';

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
        <div>
  <button onClick={toggleTheme} className="btn btn-outline-light me-2">
    {darkMode ? 'Light Mode' : 'Dark Mode'}
  </button>
  <a href="#about" className="btn btn-outline-light me-2">About</a>
  <a href="#contact" className="btn btn-outline-light me-2">Contact Us</a>
  <a href="/admin" className="btn btn-outline-light me-2">Admin</a>
  <a href="/login" className="btn btn-outline-light me-2">Login</a>
  <a href="/signup" className="btn btn-warning text-dark">Sign Up</a>
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
