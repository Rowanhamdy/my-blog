import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Gurd({ children }) {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setShowMessage(true); // Show message
      const timer = setTimeout(() => {
        navigate('/login');
      }, 1500); // 1.5 second delay before redirect
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn && showMessage) {
    return (
      <div className='text-center p-10 logo-text ' >
        <h2 className='font-bold mt-50'>Please login first</h2>
        <p>Redirecting to login page...</p>
      </div>
    );
  }

  return children;
}
