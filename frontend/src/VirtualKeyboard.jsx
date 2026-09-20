import React, { useEffect, useState, useCallback, useRef } from 'react';

let audioCtx = null;

const playClickSound = () => {
  if (!window.AudioContext && !window.webkitAudioContext) return;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  // A short noise/click sound approximation
  oscillator.type = 'square';
  // Slight pitch randomization
  oscillator.frequency.setValueAtTime(150 + Math.random() * 50, audioCtx.currentTime); 
  
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.005);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + 0.05);
};

const keyboardLayout = [
  ['ESC', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'BACK'],
  ['TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', 'ENTER'],
  ['CAPS', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", '\\'],
  ['SHIFT', '<', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'SHIFT', 'UP'],
  ['CTRL', 'FN', 'SPACE', 'ALT GR', 'CTRL', 'LEFT', 'DOWN', 'RIGHT']
];

const VirtualKeyboard = ({ onKeyPress }) => {
  const [activeKey, setActiveKey] = useState(null);

  const handleKeyAction = useCallback((key) => {
    playClickSound();
    setActiveKey(key.toUpperCase());
    
    setTimeout(() => {
      setActiveKey(null);
    }, 100);

    if (onKeyPress) {
      onKeyPress(key);
    }
  }, [onKeyPress]);

  useEffect(() => {
    const handlePhysicalKeyDown = (e) => {
      // Don't intercept everything if they are typing in an input,
      // but we do want the sound and visual feedback.
      const key = e.key.toUpperCase();
      let visualKey = key;
      if (e.code === 'Space') visualKey = 'SPACE';
      if (e.code === 'Backspace') visualKey = 'BACK';
      if (e.code === 'Enter') visualKey = 'ENTER';
      if (e.code === 'ArrowUp') visualKey = 'UP';
      if (e.code === 'ArrowDown') visualKey = 'DOWN';
      if (e.code === 'ArrowLeft') visualKey = 'LEFT';
      if (e.code === 'ArrowRight') visualKey = 'RIGHT';

      playClickSound();
      setActiveKey(visualKey);
      
      // Auto-clear visual state
      setTimeout(() => {
        setActiveKey((prev) => prev === visualKey ? null : prev);
      }, 100);
    };

    window.addEventListener('keydown', handlePhysicalKeyDown);
    return () => {
      window.removeEventListener('keydown', handlePhysicalKeyDown);
    };
  }, []);

  const renderKey = (label) => {
    let className = "key";
    if (label === 'SPACE') className += " space";
    else if (['BACK', 'ENTER', 'SHIFT', 'CAPS', 'TAB'].includes(label)) className += " wide";
    else if (['CTRL', 'FN', 'ALT GR'].includes(label)) className += " extra-wide";

    if (activeKey === label) className += " active";

    return (
      <div 
        key={label} 
        className={className}
        onMouseDown={() => handleKeyAction(label)}
      >
        {label}
      </div>
    );
  };

  return (
    <div className="keyboard-container">
      {keyboardLayout.map((row, i) => (
        <div key={i} className="keyboard-row">
          {row.map(key => renderKey(key))}
        </div>
      ))}
    </div>
  );
};

export default VirtualKeyboard;
