import React, { useState } from 'react';
import parse from 'html-react-parser';

function BehindTheScenes({ title, description }) {
  const parsedDescription = parse(description);
  const upCaretUrl = '/assets/img/up_caret.svg';
  const downCaretUrl = '/assets/img/down_caret.svg';
  const [showDesc, setShowDesc] = useState(false);

  return (
    <div className="bts-holder">
      <div
        className="bts-header"
        onClick={() => {
          setShowDesc(!showDesc);
        }}
      >
        {showDesc ? (
          <img src={downCaretUrl} alt="caret" />
        ) : (
          <img src={upCaretUrl} alt="caret" />
        )}
        <h1>{title}</h1>
      </div>
      {showDesc && <div className="bts-desc">{parsedDescription}</div>}
    </div>
  );
}

export default BehindTheScenes;
