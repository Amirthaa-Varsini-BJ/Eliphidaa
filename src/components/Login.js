import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }
    const userData = { name: email.split("@")[0], email };
    localStorage.setItem("elphiUser", JSON.stringify(userData));
    setIsLoggedIn(true);
    navigate("/dashboard");
  };

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "100px auto" }}>
      <h2>Login (Simplified for Debug)</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: "10px" }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: "10px" }} />
        <button type="submit" style={{ padding: "10px", background: "#4A6FFF", color: "white", border: "none", cursor: "pointer" }}>Login</button>
      </form>
    </div>
  );
};

export default Login;
        setIsDarkMode(prevMode => !prevMode);
    };
    useEffect(() => {
  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = "auto";
  };
}, []);

    useEffect(() => {
        // Sparkle creation logic (unchanged)
        const createSparkle = (x, y) => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = `${x}px`;
            sparkle.style.top = `${y}px`;

            (sparkleContainerRef.current || document.body).appendChild(sparkle);

            sparkle.addEventListener('animationend', () => {
                sparkle.remove();
            });
        };

        // Mouse move event handler (unchanged)
        const handleMouseMove = (e) => {
            if (Math.random() < 0.1) {
                createSparkle(e.clientX, e.clientY);
            }
        };

        document.addEventListener('mousemove', handleMouseMove);

        // Book open animation trigger (unchanged)
        const timer = setTimeout(() => {
            if (loginFormWrapperRef.current) {
                loginFormWrapperRef.current.classList.add('is-open');
                bookOpenSound.play().catch(error => {
                    console.warn("Could not play book open sound:", error);
                });
            }
        }, 100);

        // Cleanup function
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className="login-page-wrapper">
            {/* Dark Mode Toggle Button */}
            <button
                className="dark-mode-toggle btn btn-sm"
                onClick={toggleDarkMode}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
                <i className={`bi ${isDarkMode ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`}></i>
            </button>

            <div ref={sparkleContainerRef} className="sparkle-container"></div>

            <div className="waves-background">
                <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
                    <defs>
                        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                    </defs>
                    <g className="parallax">
                        {/* Wave fills will be adjusted by CSS variables */}
                        <use xlinkHref="#gentle-wave" x="48" y="0" />
                        <use xlinkHref="#gentle-wave" x="48" y="3" />
                        <use xlinkHref="#gentle-wave" x="48" y="5" />
                        <use xlinkHref="#gentle-wave" x="48" y="7" />
                    </g>
                </svg>
            </div>

            <div className="container d-flex align-items-center justify-content-center login-container">
                <div ref={loginFormWrapperRef} className="login-form-book-wrapper">
                    <div className="login-form p-4">
                        <h1 className="text-center mb-4 login-title">Welcome Back 👋</h1>
                        <form className="login-form-content" onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label>Email</label>
<input
  type="email"
  className="form-control"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>                            </div>
                            <div className="form-group mb-4">
                                <label>Password</label>
<input
  type="password"
  className="form-control"
  placeholder="Enter your password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
/>                            </div>
                            <button type="submit" className="btn btn-primary btn-block w-100 login-button">Sign In</button>

                            <a href="/forgot" className="d-block text-center mt-3 forgot-password-link">Forgot Password?</a>

                            <div className="social-login text-center mt-4">
                                <button type="button" className="btn btn-light social-button google-button">
                                    <i className="bi bi-google me-2"></i> Login with Google
                                </button>
                            </div>
                        </form>
                        <div className="mt-4 text-center register-section">
    <p>Don't have an account? <Link to="/signup">Register here</Link></p>
</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;