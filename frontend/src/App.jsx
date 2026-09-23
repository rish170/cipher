import React, { useState, useEffect } from 'react';
import ParticleBackground from './ParticleBackground';
import TerminalWindow from './TerminalWindow';
import VirtualKeyboard from './VirtualKeyboard';
import './App.css';

function App() {
  const [lastKeyPressed, setLastKeyPressed] = useState(null);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.log("Fullscreen request denied or not supported:", err);
        });
      }
      // Remove listeners after first interaction
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  const handleVirtualKeyPress = (key) => {
    // If we wanted to manually insert text into the input from the virtual keyboard,
    // we would manage the input state here and pass it down. 
    // For simplicity, physical typing works natively, and virtual clicking is for show/feedback.
    // To make it fully functional, we'd need to manage input state globally.
  };

  return (
    <div className="app-container">
      <ParticleBackground />
      
      <div className="tab-bar">
        <div className="tab active">MAIN SHELL</div>
      </div>

      <div className="main-content">
        <TerminalWindow />
      </div>

      <VirtualKeyboard onKeyPress={handleVirtualKeyPress} />
    </div>
  );
}

export default App;
