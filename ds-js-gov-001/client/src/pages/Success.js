import React from 'react';
import parse from 'html-react-parser';
import { useNavigate } from 'react-router-dom';
import UserProfile from '../components/UserProfile';

function Success({
  text,
  title,
  description,
  includeContinueButton,
  continueUrl,
  avatarUrl,
  userRoleName,
}) {
  let navigate = useNavigate();
  const backLinkName = 'Back to Home';
  const continueLinkName = 'Continue';
  const checkMarkURL = '/assets/img/check.svg';

  return (
    <section className="content-section">
      <div className="success-container">
        {avatarUrl === undefined && userRoleName === undefined && (
          <img
            className="success-check"
            src={checkMarkURL}
            alt="success-check"
          />
        )}
        <div className="success-header-container">
          {text ? <h1>{text.title}</h1> : <h1>{title}</h1>}
        </div>

        <div className="success-content">
          <div className="success-text">
            {avatarUrl && userRoleName && (
              <UserProfile
                avatarUrl={avatarUrl}
                userRoleName={userRoleName}
                includeMoreInfo={false}
              />
            )}
            {text ? text.description : parse(description)}
          </div>

          {includeContinueButton && continueUrl ? (
            <div className="button-container">
              <button
                className="black-button"
                onClick={() => {
                  navigate(continueUrl);
                }}
              >
                {continueLinkName}
              </button>

              <button
                className="grey-button"
                onClick={() => navigate('/index')}
              >
                {backLinkName}
              </button>
            </div>
          ) : (
            <button className="grey-button" onClick={() => navigate('/index')}>
              {backLinkName}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default Success;
