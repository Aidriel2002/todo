import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './auth/firebase';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../Dashboard';
import RecycleBin from './RecycleBin';
import './AuthDetails.css'

const AuthDetails = () => {
  const [displayName, setDisplayName] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const history = useNavigate();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        setDisplayName(user.displayName);
      } else {
        setAuthUser(null);
        setDisplayName(null);
        setShowDropdown(false);
      }
    });

    return () => {
      listen();
    };
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
        history('/');
      })
      .catch((error) => console.log(error));
  };

  const handleTrashClick = () => {
    setShowRecycleBin(true);
  };

  const handleBackToDashboard = () => {
    setShowRecycleBin(false);
  };

  const navigateToHome = () => {
    history('/dashboard');
  };

  return (
    <div className="user-container">
      {authUser ? (
        <div className="user">
          <img src="logoW.png" alt="logoW" />
          <div className="nav-links">
            <a href="#Home" onClick={navigateToHome}>Dashboard</a>
            <a href="#Ongoing">Ongoing</a>
            <a href="#Completed">Completed</a>
            <a href="#Trash" onClick={handleTrashClick}>Trash</a>
          </div>
          <div className="user-right">
            <p className='authName'>{`${displayName}`}</p>
            <span className="dropdown-icon" onClick={toggleDropdown}>
              &#9660;
            </span>
            {showDropdown && (
              <div className="dropdown-content">
                <button onClick={userSignOut}>Logout</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p></p>
      )}

      {showRecycleBin ? (
        <RecycleBin onBackToDashboard={handleBackToDashboard} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
};

export default AuthDetails;
