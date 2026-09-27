import React from 'react';

const LandingPage = ({ onStart }) => {
  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1 className="landing-title">Cipher</h1>
        <button className="landing-button" onClick={onStart}>
          Try Cipher
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
