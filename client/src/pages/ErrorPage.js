import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ErrorPage() {
  let navigate = useNavigate();
  const { state } = useLocation();
  const defaultTitle = 'Unknown error occurred';
  const backLinkName = 'Back to Home';

  return (
    <section className="content-section">
      <div className="error-container">
        {state && state.title ? (
          <>
            <h1>{state.title}</h1>
            {state.description}
          </>
        ) : (
          <h1>{defaultTitle}</h1>
        )}
        <button
          className="grey-button-fixed-size"
          onClick={() => navigate('/index')}
        >
          {backLinkName}
        </button>
      </div>
    </section>
  );
}

export default ErrorPage;
