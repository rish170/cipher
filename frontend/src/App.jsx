import React, { useState, useEffect } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import ParticleBackground from './ParticleBackground';
import TerminalWindow from './TerminalWindow';
import VirtualKeyboard from './VirtualKeyboard';
import LandingPage from './LandingPage';
import './App.css';

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [lastKeyPressed, setLastKeyPressed] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.log("Fullscreen request denied or not supported:", err);
        });
      }
      window.removeEventListener('click', handleFirstInteraction);
    };

    const handleKeyDown = (e) => {
      // Prevent F11 default fullscreen so we rely strictly on HTML5 Fullscreen API
      if (e.key === 'F11') {
        e.preventDefault();
        e.stopPropagation();
        console.log("F11 blocked by Cipher");
        return false;
      }
      
      // Auto-start fullscreen on first keypress if not already in fullscreen
      if (!document.fullscreenElement) {
        handleFirstInteraction();
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    window.addEventListener('click', handleFirstInteraction, { capture: true });
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('click', handleFirstInteraction, { capture: true });
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen().catch(err => console.error(err));
    }
  };

  const handleVirtualKeyPress = (key) => {
    // Virtual keyboard handler if needed
  };

  return (
    <div className="app-container">
      <ParticleBackground />
      
      {!isStarted ? (
        <LandingPage onStart={() => setIsStarted(true)} />
      ) : (
        <>
          <div className="tab-bar">
            <div className="tab active">MAIN SHELL</div>
          </div>

          <div className="main-content">
            <TerminalWindow />
          </div>

          <VirtualKeyboard onKeyPress={handleVirtualKeyPress} />
        </>
      )}

      {/* Global Fullscreen Toggle */}
      <button 
        className="fullscreen-toggle-btn" 
        onClick={toggleFullscreen}
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
      </button>
    </div>
  );
}

export default App;
