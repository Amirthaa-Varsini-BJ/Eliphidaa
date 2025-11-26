import React from 'react';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { APP_NAME } from '../constants';

const LoginPage = ({
  onLoginSuccess,
  onNavigateToSignup,
  currentTheme,
  onThemeToggle,
  onNavigateToHome
}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      console.log('Login attempt with:', { email, password });
      alert('Login successful! (Simulated)');
      onLoginSuccess();
    } else {
      alert('Please enter email and password.');
    }
  };

  return (
    <div className={`auth-page-container ${currentTheme === 'dark' ? 'dark' : ''} bg-blue-100 dark:bg-blue-900`}>
      <div className="absolute top-4 right-4 flex items-center space-x-2 z-20">
        <button
          onClick={onNavigateToHome}
          className="px-4 py-2 text-sm font-medium text-blue-800 dark:text-blue-200 hover:bg-blue-300 dark:hover:bg-blue-700 rounded-full transition-colors"
          aria-label="Go to Home"
        >
          Home
        </button>
        <button 
          onClick={onThemeToggle} 
          className="p-2 rounded-full text-blue-800 dark:text-blue-200 hover:bg-blue-300 dark:hover:bg-blue-700 transition-colors"
          aria-label="Toggle theme"
        >
          {currentTheme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Placeholder for 3D designs */}
      <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-blue-300 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-80px] right-[-60px] w-60 h-60 bg-blue-400 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute top-[20%] right-[10%] w-32 h-32 bg-blue-500 rounded-full opacity-40 animate-pulse"></div>

      {/* Placeholder for animated character */}
      <div className="absolute bottom-10 left-10 animate-bounce">
        <img src="/path/to/animated-character.gif" alt="Animated Character" className="w-32 h-32" />
      </div>

      <div className="relative z-10 w-full max-w-md p-8 md:p-12 space-y-8 bg-white dark:bg-blue-800 shadow-2xl dark:shadow-3d-dark rounded-3xl transform transition-all duration-500 ease-out animate-fade-in-up">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-200 tracking-tight">{APP_NAME}</h1>
          <p className="mt-2 text-lg text-blue-600 dark:text-blue-300">Welcome Back!</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email-login" className="sr-only">Email address</label>
            <input
              id="email-login"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              placeholder="Email Address"
            />
          </div>
          <div>
            <label htmlFor="password-login" className="sr-only">Password</label>
            <input
              id="password-login"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              placeholder="Password"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <a href="#" className="font-medium text-blue-800 hover:text-blue-600 dark:text-blue-200 dark:hover:text-blue-300 transition-colors">
              Forgot your password?
            </a>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg text-lg font-semibold text-white bg-blue-800 hover:bg-blue-700 dark:bg-blue-200 dark:text-blue-800 dark:hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
            >
              Sign In
            </button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm text-blue-600 dark:text-blue-300">
          Don't have an account?{' '}
          <button type="button" onClick={onNavigateToSignup} className="font-semibold text-blue-800 hover:text-blue-600 dark:text-blue-200 dark:hover:text-blue-300 underline transition-colors">
            Sign up now
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
