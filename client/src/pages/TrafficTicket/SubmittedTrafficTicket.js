import React, { useEffect, useRef, useState } from 'react';
import { handleError } from '../../api/apiHelper';
import axios from 'axios';
import Success from '../Success';
import { useNavigate } from 'react-router-dom';

function SubmittedTrafficTicket({ text }) {
  let navigate = useNavigate();
  let mountedRef = useRef(true);
  const millieAvatarUrl = '/assets/img/millie_avatar.png';
  const codyAvatarUrl = '/assets/img/cody_avatar.png';
  const witnessStatementUrl =
    '/receive-traffic-ticket/request-witness-statement';
  const mitigationClerkName = text.names.mitigationClerkName;
  const contestedClerkName = text.names.contestedClerkName;
  const [userChoice, setUserChoice] = useState('');
  const [userRoleName, setUserRoleName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    getUserChoice();

    // Clean up
    return () => {
      mountedRef.current = false;
    };
  });

  // GETs the user choice (plead guilty, no contest, request mitigation
  // hearing, or request contested hearing). Then sets the title and
  // description of the page accordingly.
  async function getUserChoice() {
    try {
      let response = await axios.get('/api/trafficTicket/submitted');

      // Only set states if the component is mounted, otherwise return null.
      if (!mountedRef.current) return null;

      setUserChoice(response.data);

      // Set the avatar URL, title, and description based on user choice
      if (response.data === 'Mitigation') {
        setTitle(text.submitted.mitigation.title);
        setDescription(
          text.submitted.mitigation.description.replaceAll(
            '{mitigationClerkName}',
            mitigationClerkName
          )
        );
        setUserRoleName(mitigationClerkName);
        setAvatarUrl(millieAvatarUrl);
      } else if (response.data === 'Contested') {
        setTitle(text.submitted.contestedSuccess.title);
        setDescription(
          text.submitted.contestedSuccess.description.replaceAll(
            '{contestedClerkName}',
            contestedClerkName
          )
        );
        setUserRoleName(contestedClerkName);
        setAvatarUrl(codyAvatarUrl);
      } else {
        setTitle(text.submitted.paidFine.title);
        setDescription(text.submitted.paidFine.description);
      }
    } catch (error) {
      console.log(error);
      const errorPageText = handleError(error);
      navigate('/error', { state: errorPageText });
    }
  }

  return (
    <>
      {userChoice === 'Contested' ? (
        <Success
          title={title}
          description={description}
          includeContinueButton={true}
          continueUrl={witnessStatementUrl}
          avatarUrl={avatarUrl}
          userRoleName={userRoleName}
        />
      ) : userChoice === 'Mitigation' ? (
        <Success
          title={title}
          description={description}
          avatarUrl={avatarUrl}
          userRoleName={userRoleName}
        />
      ) : (
        <Success title={title} description={description} />
      )}
    </>
  );
}

export default SubmittedTrafficTicket;
