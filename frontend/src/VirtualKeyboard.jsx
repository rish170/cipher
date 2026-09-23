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
  // Row 1
  {
    main: [{l: 'ESC'}, {spacer: 'small'}, {l: 'F1'}, {l: 'F2'}, {l: 'F3'}, {l: 'F4'}, {spacer: 'small'}, {l: 'F5'}, {l: 'F6'}, {l: 'F7'}, {l: 'F8'}, {spacer: 'small'}, {l: 'F9'}, {l: 'F10'}, {l: 'F11'}, {l: 'F12'}],
    nav: [{l: 'PRINT\nSCREEN', c: 'nav-key'}, {l: 'SCROLL\nLOCK', c: 'nav-key'}, {l: 'PAUSE\nBREAK', c: 'nav-key'}]
  },
  // Row 2
  {
    main: [{l: '~\n`'}, {l: '!\n1'}, {l: '@\n2'}, {l: '#\n3'}, {l: '$\n4'}, {l: '%\n5'}, {l: '^\n6'}, {l: '&\n7'}, {l: '*\n8'}, {l: '(\n9'}, {l: ')\n0'}, {l: '_\n-'}, {l: '+\n='}, {l: 'BACKSPACE', c: 'backspace'}],
    nav: [{l: 'INSERT', c: 'nav-key'}, {l: 'HOME', c: 'nav-key'}, {l: 'PAGE\nUP', c: 'nav-key'}]
  },
  // Row 3
  {
    main: [{l: 'TAB', c: 'tab'}, {l: 'Q'}, {l: 'W'}, {l: 'E'}, {l: 'R'}, {l: 'T'}, {l: 'Y'}, {l: 'U'}, {l: 'I'}, {l: 'O'}, {l: 'P'}, {l: '{\n['}, {l: '}\n]'}, {l: '|\n\\', c: 'backslash'}],
    nav: [{l: 'DELETE', c: 'nav-key'}, {l: 'END', c: 'nav-key'}, {l: 'PAGE\nDOWN', c: 'nav-key'}]
  },
  // Row 4
  {
    main: [{l: 'CAPS LOCK', c: 'caps'}, {l: 'A'}, {l: 'S'}, {l: 'D'}, {l: 'F'}, {l: 'G'}, {l: 'H'}, {l: 'J'}, {l: 'K'}, {l: 'L'}, {l: ':\n;'}, {l: '"\n\''}, {l: 'ENTER', c: 'enter'}],
    nav: []
  },
  // Row 5
  {
    main: [{l: 'SHIFT', c: 'shift-l', val: 'SHIFT'}, {l: 'Z'}, {l: 'X'}, {l: 'C'}, {l: 'V'}, {l: 'B'}, {l: 'N'}, {l: 'M'}, {l: '<\n,'}, {l: '>\n.'}, {l: '?\n/'}, {l: 'SHIFT', c: 'shift-r', val: 'SHIFT'}],
    nav: [{spacer: 'arrow-gap'}, {l: '↑', c: 'nav-key arrow'}, {spacer: 'arrow-gap'}]
  },
  // Row 6
  {
    main: [{l: 'CTRL', c: 'ctrl', val: 'CTRL'}, {l: 'FN', c: 'ctrl', val: 'FN'}, {l: '⊞', c: 'ctrl', val: 'META'}, {l: 'ALT', c: 'ctrl', val: 'ALT'}, {l: 'SPACE', c: 'space', val: 'SPACE'}, {l: 'ALT GR', c: 'ctrl', val: 'ALT GR'}, {l: 'CTRL', c: 'ctrl', val: 'CTRL'}],
    nav: [{l: '←', c: 'nav-key arrow'}, {l: '↓', c: 'nav-key arrow'}, {l: '→', c: 'nav-key arrow'}]
  }
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
      const key = e.key.toUpperCase();
      let visualKey = key;
      if (e.code === 'Space') visualKey = 'SPACE';
      if (e.code === 'Backspace') visualKey = 'BACKSPACE';
      if (e.code === 'Enter') visualKey = 'ENTER';
      if (e.code === 'ArrowUp') visualKey = '↑';
      if (e.code === 'ArrowDown') visualKey = '↓';
      if (e.code === 'ArrowLeft') visualKey = '←';
      if (e.code === 'ArrowRight') visualKey = '→';
      if (e.code === 'Escape') visualKey = 'ESC';
      if (key === 'CONTROL') visualKey = 'CTRL';
      if (key === 'META') visualKey = 'META';

      playClickSound();
      setActiveKey(visualKey);
      
      setTimeout(() => {
        setActiveKey((prev) => prev === visualKey ? null : prev);
      }, 100);
    };

    window.addEventListener('keydown', handlePhysicalKeyDown);
    return () => {
      window.removeEventListener('keydown', handlePhysicalKeyDown);
    };
  }, []);

  const renderKeyContent = (label) => {
    if (label.includes('\n')) {
      const parts = label.split('\n');
      return (
        <div className="dual-key">
          <span>{parts[0]}</span>
          <span>{parts[1]}</span>
        </div>
      );
    }
    return label;
  };

  const renderKey = (keyObj, index) => {
    if (keyObj.spacer) {
      return <div key={`spacer-${index}`} className={`spacer ${keyObj.spacer}`}></div>;
    }

    const label = keyObj.l;
    const val = keyObj.val || label;
    let className = `key ${keyObj.c || ''}`;

    if (activeKey === val.toUpperCase() || activeKey === label.toUpperCase()) {
      className += " active";
    }

    return (
      <div 
        key={index} 
        className={className.trim()}
        onMouseDown={() => handleKeyAction(val)}
      >
        {renderKeyContent(label)}
      </div>
    );
  };

  return (
    <div className="keyboard-wrapper">
      <div className="keyboard-container">
        {keyboardLayout.map((row, i) => (
          <div key={i} className="keyboard-row">
            <div className="key-group main">
              {row.main.map((keyObj, j) => renderKey(keyObj, j))}
            </div>
            <div className="key-group nav">
              {row.nav.map((keyObj, j) => renderKey(keyObj, j))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualKeyboard;
