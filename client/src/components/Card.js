import React from 'react';
import parse from 'html-react-parser';
import { Link } from 'react-router-dom';

function Card({ cardType, buttonType, iconUrl, title, featureList, linkTo }) {
  const buttonName = 'Get Started';
  const featureListTitle = 'Docusign features:';

  return (
    <div className={cardType}>
      <div className="image-holder">
        <img src={iconUrl} width="35px" height="auto" alt="card-icon" />
      </div>
      <h3 className="card-title">{title}</h3>
      <h4 className="card-features">{featureListTitle}</h4>
      <ul>{parse(featureList)}</ul>

      <div className="card-btn-container">
        <Link to={linkTo} rel="noopener noreferrer">
          <button className={buttonType} type="button">
            {buttonName}
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Card;
