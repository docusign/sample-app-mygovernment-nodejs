import React from 'react';

function UserProfile({
  buttonName,
  avatarUrl,
  userRoleName,
  includeMoreInfo,
  popUpOpen,
  setPopUpOpen,
}) {
  return (
    <div className="user-profile">
      <img src={avatarUrl} alt="user-profile" />
      <h3>{userRoleName}</h3>
      {includeMoreInfo ? (
        <button
          onClick={() => {
            setPopUpOpen(!popUpOpen);
          }}
        >
          {buttonName}
        </button>
      ) : (
        // Empty div to take up space to keep form height the same.
        <div height="16px">&nbsp;</div>
      )}
    </div>
  );
}

export default UserProfile;
