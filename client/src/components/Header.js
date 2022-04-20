import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header({ text }) {
  const appName = 'MyGovernment';
  const logoUrl = '/static/img/logo.svg';
  let location = useLocation();

  return (
    <header className="header" role="banner">
      <nav className="navbar">
        {location.pathname !== '/' ? (
          <>
            <Link className="nav-logo" to="/index">
              <img src={logoUrl} alt="logo" />
              {appName}
            </Link>
            <a
              className="nav-btn"
              href={text.githubLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {text.githubButton}
            </a>
          </>
        ) : (
          <div className="nav-logo">
            <img src={logoUrl} alt="logo" />
            {appName}
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
