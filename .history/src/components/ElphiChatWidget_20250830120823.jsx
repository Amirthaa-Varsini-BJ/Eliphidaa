import React, { useState, useEffect, useRef } from 'react';
import './ElphiChatWidget.css';
import ReactMarkdown from 'react-markdown';

function ElphiChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleOpen = () => setOpen((v) => !v);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => { scrollToBottom(); }, [messages, open]);

  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const payload = {
        contents: [{ role: 'user', parts: [{ text: userMessage.text }] }],
      };

      const apiKey = "AIzaSyBB152D1cfIb5MVc8prtyeVnBOpt6v4APk"; // Put your Gemini API key
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      const reply =
        result?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't get a response.";

      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: '❌ Error connecting to AI.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyMessage = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard ✅');
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const editMessage = (index) => {
    const msg = messages[index];
    if (msg.sender !== 'user') return;
    setInput(msg.text);
    setMessages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="elphi-widget">
      {/* Floating Bot Button */}
      <button
        className={`elphi-toggle ${open ? 'open' : ''}`}
        onClick={toggleOpen}
        aria-expanded={open}
        aria-label={open ? 'Close Chat' : 'Open Chat'}
      >
        {/* Use any cute bot image or emoji */}
        🤖
      </button>

      {/* Chat Panel */}
      <div className={`elphi-panel ${open ? 'show' : ''}`}>
        <div className="elphi-header">
          <div className="elphi-avatar">E</div>
          <div className="elphi-title">
            <div className="name">Elphi</div>
            <div className="sub">Your learning helper</div>
          </div>
        </div>

        <div className="elphi-messages" role="log" aria-live="polite">
          {messages.length === 0 && (
            <div className="elphi-empty">
              Ask me anything! Try: “Explain recursion with an example.”
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`elphi-msg ${m.sender}`}>
              <div className="bubble">
                <ReactMarkdown>{m.text}</ReactMarkdown>
                <div className="msg-actions">
                  <button
                    className="icon-btn"
                    onClick={() => copyMessage(m.text)}
                    title="Copy"
                  >
                    📋
                  </button>
                  {m.sender === 'user' && (
                    <button
                      className="icon-btn"
                      onClick={() => editMessage(i)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="elphi-msg ai">
              <div className="bubble">
                <span className="dots">
                  <span></span><span></span><span></span>
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="elphi-input">
          <textarea
            className="elphi-textarea"
            placeholder="Type a message…"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            className="elphi-send"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default ElphiChatWidget;
