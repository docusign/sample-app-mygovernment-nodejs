import React, { useState } from 'react';
import { handleError, sendRequest } from '../api/apiHelper';
import Form from '../components/Form';
import { useNavigate } from 'react-router-dom';
import BehindTheScenes from '../components/BehindTheScenes';

function Passport({ text, formText, btsText }) {
  let navigate = useNavigate();
  const [requesting, setRequesting] = useState(false);
  const avatarUrl = `${process.env.REACT_APP_API_URL}/assets/img/default_avatar.png`;

  // Sends POST request to server to send envelope based on the
  // info the user provided in the form.
  async function handleSubmit(event) {
    setRequesting(true);

    // Make request body
    const body = {
      signerName: event.firstName + ' ' + event.lastName,
      signerEmail: event.signerEmail,
    };

    // Send request to server
    try {
      const response = await sendRequest(`${process.env.REACT_APP_API_URL}/api/passportApplication`, body);
      console.log(response.data);

      // Redirect to success screen
      navigate('/success');
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
          onSubmit={handleSubmit}
          includeMoreInfo={false}
          submitted={requesting}
        />
        <BehindTheScenes
          title={btsText.title}
          description={btsText.passport.description}
        />
      </div>
    </section>
  );
}

export default Passport;
