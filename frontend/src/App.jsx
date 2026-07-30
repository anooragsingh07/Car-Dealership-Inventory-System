import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';

export default function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem('user'); }
    }
  }, []);

  function handleLogin(userData) {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem('user');
  }

  if (!user) {
    return (
      <div>
        {showRegister ? <RegisterForm onLogin={handleLogin} /> : <LoginForm onLogin={handleLogin} />}
        <p className="text-center text-sm text-steel mt-4">
          {showRegister ? (
            <>Already have an account? <button onClick={() => setShowRegister(false)} className="text-brass underline cursor-pointer">Login</button></>
          ) : (
            <>Don't have an account? <button onClick={() => setShowRegister(true)} className="text-brass underline cursor-pointer">Register</button></>
          )}
        </p>
      </div>
    );
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}
