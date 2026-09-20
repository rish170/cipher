import React, { useState } from 'react';
import ParticleBackground from './ParticleBackground';
import TerminalWindow from './TerminalWindow';
import VirtualKeyboard from './VirtualKeyboard';
import './App.css';

function App() {
  const [lastKeyPressed, setLastKeyPressed] = useState(null);

  // We can pass the physical key press down if we wanted the keyboard 
  // to insert characters, but standard input focus handles this better.
  // The VirtualKeyboard mainly provides the sound and visual feedback, 
  // and clicking it can trigger the onKeyPress.

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
        <div className="tab">EMPTY</div>
        <div className="tab">EMPTY</div>
        <div className="tab">EMPTY</div>
      </div>

      <div className="main-content">
        <TerminalWindow />
      </div>

      <VirtualKeyboard onKeyPress={handleVirtualKeyPress} />
    </div>
  );
}

export default App;
