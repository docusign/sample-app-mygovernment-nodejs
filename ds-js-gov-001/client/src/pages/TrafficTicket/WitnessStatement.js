import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, sendRequest } from '../../api/apiHelper';
import Form from '../../components/Form';
import BehindTheScenes from '../../components/BehindTheScenes';
import Success from '../Success';

function WitnessStatement({ text, formText, btsText }) {
  let navigate = useNavigate();
  const [requesting, setRequesting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const codyAvatarUrl = '/assets/img/cody_avatar.png';
  const paulaAvatarUrl = '/assets/img/paula_avatar.png';
  const policeName = text.names.policeName;
  const description = text.submitted.contestedSent.description.replaceAll(
    '{policeName}',
    policeName
  );

  // Sends POST request to server with phone number to sends
  // an SMS delivery to the given phone, then updates the title
  // and description of the page.
  async function handleSubmit(event) {
    setRequesting(true);

    // Make request body
    const body = {
      signerName: policeName,
      countryCode: event.countryCode,
      phoneNumber: event.phoneNumber,
    };

    // Send request to server
    try {
      const response = await sendRequest('/trafficTicket/sms', body);
      console.log(response.data);

      // Set submitted to true to rerender page.
      setSubmitted(true);
    } catch (error) {
      console.log(error);
      const errorPageText = handleError(error);
      navigate('/error', { state: errorPageText });
    }
  }

  return (
    <>
      {!submitted ? (
        <section className="content-section">
          <div className="container">
            <div className="header-container">
              <h1>{text.submitted.contestedForm.title}</h1>
            </div>
            <Form
              avatarUrl={codyAvatarUrl}
              userRoleName={text.names.contestedClerkName}
              text={formText}
              includePhone={true}
              includeMoreInfo={false}
              placeholderName={policeName}
              nameLabel={formText.officerNameLabel}
              onSubmit={handleSubmit}
              submitted={requesting}
            />
            <BehindTheScenes
              title={btsText.title}
              description={btsText.witnessStatement.description}
            />
          </div>
        </section>
      ) : (
        <Success
          title={text.submitted.contestedSent.title}
          description={description}
          avatarUrl={paulaAvatarUrl}
          userRoleName={policeName}
        />
      )}
    </>
  );
}

export default WitnessStatement;
