import React from 'react';

function Footer({ text }) {
  return (
    <div className="footer-container">
      <h1>{text.title}</h1>
      {text.description}

      <div className="footer-btn-container">
        <a
          className="footer-btn"
          href={text.getFreeLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {text.getFreeLinkName}
        </a>
        <a
          className="footer-btn"
          href={text.learnMoreLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {text.learnMoreName}
        </a>
      </div>
    </div>
  );
}

export default Footer;
