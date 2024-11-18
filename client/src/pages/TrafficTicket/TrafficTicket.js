import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, sendRequest } from '../../api/apiHelper';
import Form from '../../components/Form';
import BehindTheScenes from '../../components/BehindTheScenes';

function TrafficTicket({ text, formText, btsText, userFlowText }) {
  let navigate = useNavigate();
  const [requesting, setRequesting] = useState(false);
  const avatarUrl = `${process.env.REACT_APP_API_URL}/assets/img/default_avatar.png`;

  // Sends POST request to server requesting redirect URL for embedded signing
  // based on the info the user put in the form.
  async function handleSubmit(event) {
    setRequesting(true);

    // Make request body
    const body = {
      signerName: event.firstName + ' ' + event.lastName,
      signerEmail: event.signerEmail,
    };

    // Send request to server
    try {
      const response = await sendRequest(`${process.env.REACT_APP_API_URL}/api/trafficTicket`, body);

      // Received URL for embedded signing, redirect user
      if (response.status === 200) {
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
      <div className="container">
        <div className="header-container">
          <h1>{text.title}</h1>
        </div>
        <Form
          avatarUrl={avatarUrl}
          userRoleName={text.names.userRoleName}
          text={formText}
          userFlowText={userFlowText}
          onSubmit={handleSubmit}
          submitted={requesting}
        />
        <BehindTheScenes
          title={btsText.title}
          description={btsText.trafficTicket.description}
        />
      </div>
    </section>
  );
}

export default TrafficTicket;
