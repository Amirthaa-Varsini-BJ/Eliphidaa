import React, { useState } from 'react';
import { APP_NAME } from '../constants';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from '../../elphida-3d/src/components/icons/MoonIcon';

export const LoginPage = ({
  onLoginSuccess,
  onNavigateToSignup,
  onNavigateToHome,
  currentTheme,
  onThemeToggle,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      console.log('Login attempt with:', { email, password });
      alert('Login successful! (Simulated)');
      onLoginSuccess();
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div className={`auth-page-container ${currentTheme === 'light' ? 'bg-neutral-lightest' : 'bg-neutral-darkest'}`}>
      {/* Background Circles */}
      <div className="absolute top-[-25%] left-[-25%] w-72 h-72 sm:w-96 sm:h-96 bg-loginMaroon rounded-full filter blur-3xl opacity-50 dark:opacity-40 animate-pulse-bg-1"></div>
      <div className="absolute bottom-[-30%] right-[-25%] w-80 h-80 sm:w-[28rem] sm:h-[28rem] bg-loginYellow rounded-full filter blur-3xl opacity-50 dark:opacity-40 animate-pulse-bg-2"></div>
      <div className="absolute top-[20%] right-[0%] sm:top-1/4 sm:right-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-loginCyan rounded-full filter blur-3xl opacity-50 dark:opacity-40 animate-pulse-bg-3"></div>

      <button
        onClick={onNavigateToHome}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 text-sm font-medium text-loginText hover:underline z-20"
        aria-label="Back to Home"
      >
        &larr; Home
      </button>
      <button
        onClick={onThemeToggle}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full hover:bg-neutral-light/30 dark:hover:bg-neutral-dark/30 transition-colors duration-200 z-20"
        aria-label="Toggle theme"
      >
        {currentTheme === 'light' ? <MoonIcon className="w-5 h-5 text-loginText" /> : <SunIcon className="w-5 h-5 text-loginText" />}
      </button>

      <div className="relative z-10 w-full max-w-xs sm:max-w-sm space-y-7">
        <h2 className="text-4xl sm:text-5xl font-bold text-loginText text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              placeholder="Enter the email"
            />
          </div>

          <div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              placeholder="••••••••••••••••"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-full text-white text-base font-semibold shadow-lg hover:shadow-xl transition-shadow transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-loginCyan/50 dark:focus:ring-offset-neutral-darkest bg-gradient-to-r from-loginMaroon from-[50%] to-loginCyan to-[50%]"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="flex justify-between items-center text-xs sm:text-sm">
          <button className="font-medium text-loginText hover:underline">
            Forgot Password
          </button>
          <button onClick={onNavigateToSignup} className="font-medium text-loginText hover:underline">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};
