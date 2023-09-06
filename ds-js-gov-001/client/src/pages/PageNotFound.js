import React from 'react';

function PageNotFound({ text }) {
  return (
    <section className="content-section">
      <div className="error-container">
        <h1>{text.title}</h1>
      </div>
    </section>
  );
}

export default PageNotFound;
