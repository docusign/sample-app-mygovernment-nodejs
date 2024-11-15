import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError } from '../../api/apiHelper';
import axios from 'axios';
import Success from '../Success';

function SubmittedLoan({ text }) {
  let mountedRef = useRef(true);
  const sageAvatarUrl = `${process.env.REACT_APP_API_URL}/assets/img/sage_avatar.png`;
  const blaireAvatarUrl = `${process.env.REACT_APP_API_URL}/assets/img/blaire_avatar.png`;
  const [lenderName, setLenderName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  let navigate = useNavigate();

  useEffect(() => {
    getLoanAmount();

    // Clean up
    return () => {
      mountedRef.current = false;
    };
  });

  // GETs the loan amount that the user inputted in their loan application,
  // and sets the lender name accordingly.
  async function getLoanAmount() {
    try{
      let response = await axios.get(`${process.env.REACT_APP_API_URL}/api/loanApplication/submitted`);

      // Only set states if the component is mounted, otherwise return null.
      if (!mountedRef.current) return null;

      setLenderName(response.data);

      if (response.data === text.names.smallLenderName) {
        setAvatarUrl(sageAvatarUrl);
      } else {
        setAvatarUrl(blaireAvatarUrl);
      }
    } catch (error) {
      console.log(error);
      const errorPageText = handleError(error);
      navigate('/error', { state: errorPageText });
    }
  }

  return (
    <Success
      title={text.submittedLoanTitle}
      description={text.description.replaceAll('{lenderName}', lenderName)}
      avatarUrl={avatarUrl}
      userRoleName={lenderName}
    />
  );
}

export default SubmittedLoan;
