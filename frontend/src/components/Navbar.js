import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* INLINE STYLES – No external CSS needed */}
      <style>{`
        .navbar {
          width: 100%;
          background: white;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .nav-logo {
          font-size: 20px;
          font-weight: 700;
          color: #2563eb;
          text-decoration: none;
        }

        .nav-logo:hover {
          color: #1e40af;
        }

        .nav-link {
          text-decoration: none;
          color: #374151;
          font-size: 15px;
          font-weight: 600;
        }

        .nav-link:hover {
          color: #2563eb;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .nav-button {
          padding: 8px 14px;
          border-radius: 8px;
          background: #2563eb;
          color: white;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: 0.2s ease;
          border: none;
          cursor: pointer;
        }

        .nav-button:hover {
          background: #1e40af;
        }

        .nav-button.light {
          background: #f3f4f6;
          color: #111;
        }

        .nav-button.light:hover {
          background: #e5e7eb;
        }

        .nav-button.red {
          background: #ef4444;
        }

        .nav-button.red:hover {
          background: #dc2626;
        }
      `}</style>

      <nav className="navbar">
        <div className="nav-left">
          <Link to="/employees" className="nav-logo">Employee Manager</Link>

          {token && (
            <Link to="/employees" className="nav-link">
              Employees
            </Link>
          )}
        </div>

        <div className="nav-right">
          {!token ? (
            <>
              <Link to="/login" className="nav-button light">Login</Link>
              <Link to="/signup" className="nav-button">Signup</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="nav-button red">
              Logout
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;