import React from 'react';
import parse from 'html-react-parser';

function Popup({ text, handleClose }) {
  const description = parse(text.description);

  return (
    <div className="popup">
      <div className="box">
        <div className="popup-header">
          <span className="close-button" onClick={handleClose}>
            &times;
          </span>
          <h1>{text.title}</h1>
        </div>

        <div className="popup-desc">{description}</div>
      </div>
    </div>
  );
}

export default Popup;
