import React, { useState, useEffect, useRef } from 'react';
import { Settings } from 'lucide-react';

const TerminalWindow = ({ onPromptSubmit }) => {
  const [messages, setMessages] = useState([
    { type: 'cipher', text: 'Welcome to CIPHER v1.0 — Language Recommendation Engine' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [apiKey, setApiKey] = useState(sessionStorage.getItem('customApiKey') || '');
  const [showSettings, setShowSettings] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toUTCString());
  const [isFocused, setIsFocused] = useState(true);
  const feedRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toUTCString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userPrompt = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { type: 'user', text: userPrompt }]);

    try {
      const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-gemini-key': apiKey
        },
        body: JSON.stringify({ idea: userPrompt })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { type: 'cipher', structured: data }]);
      } else {
        setMessages(prev => [...prev, { type: 'cipher', text: data.error }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { type: 'cipher', text: `ERR: Failed to connect to server.` }]);
    }
  };

  const handleApiKeyChange = (e) => {
    const val = e.target.value;
    setApiKey(val);
    sessionStorage.setItem('customApiKey', val);
  };

  const renderFolderTree = (structure) => {
    if (!structure || !Array.isArray(structure)) return null;
    
    // Very simplified tree rendering for flat structure input
    return structure.map((item, index) => {
      const isLast = index === structure.length - 1;
      const prefix = isLast ? '└── ' : '├── ';
      return (
        <div key={index}>
          {prefix}{item.path} — {item.description}
        </div>
      );
    });
  };

  const renderStructuredResponse = (data) => {
    return (
      <div className="structured-response">
        {data.languages && (
          <div className="structured-section">
            <span className="structured-label">Languages</span>
            <span>{data.languages.join(' + ')}</span>
          </div>
        )}
        {data.why && (
          <div className="structured-section">
            <span className="structured-label">Why</span>
            <span>{data.why}</span>
          </div>
        )}
        {data.advantages && (
          <div className="structured-section">
            <span className="structured-label">Pros</span>
            {data.advantages.map((pro, i) => <span key={i}>- {pro}</span>)}
          </div>
        )}
        {data.disadvantages && (
          <div className="structured-section">
            <span className="structured-label">Cons</span>
            {data.disadvantages.map((con, i) => <span key={i}>- {con}</span>)}
          </div>
        )}
        {data.deployment && (
          <div className="structured-section">
            <span className="structured-label">Deployment</span>
            <span>{data.deployment}</span>
          </div>
        )}
        {data.structure && (
          <div className="structured-section">
            <span className="structured-label">Structure</span>
            <div className="folder-tree">
              {renderFolderTree(data.structure)}
            </div>
          </div>
        )}
        {data._served_by && (
          <div style={{fontSize: '0.7rem', color: 'var(--border-color)', marginTop: '10px'}}>
            [served by: {data._served_by}]
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <span>~/user ❯ cipher</span>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span>{currentTime}</span>
            <Settings size={16} className="settings-icon" onClick={() => setShowSettings(!showSettings)} />
        </div>
      </div>
      
      {showSettings && (
        <div className="settings-panel">
          <label style={{ fontSize: '0.8rem', color: 'var(--accent-amber)' }}>Session API Key (Optional)</label>
          <input 
            type="password" 
            placeholder="Paste Gemini API Key..." 
            value={apiKey} 
            onChange={handleApiKeyChange}
          />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
            {apiKey ? 'Using your API key.' : 'Using default app key.'}
          </span>
        </div>
      )}

      <div className="message-feed" ref={feedRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <span className="prompt-prefix">
              {msg.type === 'user' ? '~/user ❯' : 'cipher ❯'}
            </span>
            <div className="message-content">
              {msg.text && <span>{msg.text}</span>}
              {msg.structured && renderStructuredResponse(msg.structured)}
            </div>
          </div>
        ))}
      </div>

      <form className="prompt-container" onSubmit={handleSubmit}>
        <span className="prompt-prefix" style={{color: 'var(--accent-cyan)'}}>~/.c/CIPHER ❯</span>
        <input 
          ref={inputRef}
          type="text" 
          className="prompt-input"
          style={{ caretColor: 'transparent' }}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoFocus
        />
        {isFocused && <div className="cursor-block"></div>}
      </form>
    </div>
  );
};

export default TerminalWindow;
