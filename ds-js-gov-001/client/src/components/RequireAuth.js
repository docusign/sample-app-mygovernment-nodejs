import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { handleError } from '../api/apiHelper';

function RequireAuth() {
  let navigate = useNavigate();
  let mountedRef = useRef(true);
  const [authed, setAuthed] = useState(undefined);

  useEffect(() => {
    isLoggedIn();

    // Clean up
    return () => {
      mountedRef.current = false;
    };
  });

  async function isLoggedIn() {
    try {
      let response = await axios.get('/auth/isLoggedIn');

      // Only set states if the component is mounted, otherwise return null.
      if (!mountedRef.current) return null;
      setAuthed(response.data);
    } catch (error) {
      console.log(error);
      const errorPageText = handleError(error);
      navigate('/error', { state: errorPageText });
    }
  }

  // If the user has not logged in yet, then they are redirected
  // to the login screen.
  return (
    <>
      {authed === undefined ? (
        // Empty section to make sure that the footer copyright text stays in the
        // same spot while static assets are being loaded in.
        <section className="content-section"></section>
      ) : authed ? (
        <Outlet />
      ) : (
        <Navigate to="/" replace />
      )}
    </>
  );
}

export default RequireAuth;
