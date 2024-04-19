import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError } from '../api/apiHelper';
import Footer from '../components/Footer';
import Card from '../components/Card';

function Home({ text, footerText }) {
  let navigate = useNavigate();

  useEffect(() => {
    getUserInfo();
  });

  // If the previous screen was the login screen, then
  // make sure the server has the necessary user information
  // stored for making Docusign API calls.
  async function getUserInfo() {
    try {
      let response = await axios.get('/auth/login');

      // If the user revoked consent after logging in, check to make
      // sure they still have consent
      if (response.status === 210) {
        console.log('Consent URL: ' + response.data);
        window.location = response.data;
      }
    } catch (error) {
      console.log(error);
      const errorPageText = handleError(error);
      navigate('/error', { state: errorPageText });
    }
  }

  return (
    <section className="content-section">
      <div className="home-container">
        <div className="home-header-container">
          <h1>{text.title}</h1>
        </div>
        <div className="card-holder">
          <Card
            cardType="small-business-card"
            iconUrl="/assets/img/small_business.png"
            linkTo="/apply-for-small-business-loan"
            title={text.smallBusiness}
            featureList={text.smallBusinessFeatures}
            buttonType="small-business-btn"
          />
          <Card
            cardType="traffic-ticket-card"
            iconUrl="/assets/img/traffic_ticket.png"
            linkTo="/receive-traffic-ticket"
            title={text.trafficTicket}
            featureList={text.trafficTicketFeatures}
            buttonType="traffic-ticket-btn"
          />
          <Card
            cardType="passport-card"
            iconUrl="/assets/img/passport.png"
            linkTo="/apply-for-passport"
            title={text.passportApplication}
            featureList={text.passportFeatures}
            buttonType="passport-btn"
          />
        </div>

        <Footer text={footerText} />
      </div>
    </section>
  );
}

export default Home;
