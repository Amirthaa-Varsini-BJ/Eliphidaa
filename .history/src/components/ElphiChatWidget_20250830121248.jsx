import React, { useState, useRef, useEffect } from 'react';
import './ElphiChatWidget.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ReactMarkdown from 'react-markdown';

function ElphiChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleOpen = () => setOpen(v => !v);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages, open]);

  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Dummy AI response locally
    setTimeout(() => {
      const aiReply = { sender: 'ai', text: 'Hello! I am Elphi. 🤖 I received: "' + userMessage.text + '"' };
      setMessages(prev => [...prev, aiReply]);
      setLoading(false);
    }, 800);
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
    setMessages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="elphi-widget">
      <button
        className={`elphi-toggle ${open ? 'open' : ''}`}
        onClick={toggleOpen}
        aria-expanded={open}
        aria-label={open ? 'Close Elphi chat' : 'Open Elphi chat'}
      >
        <i className={`bi ${open ? 'bi-x-lg' : 'bi-chat-dots-fill'}`} />
      </button>

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
                  <button className="icon-btn" onClick={() => copyMessage(m.text)} title="Copy">
                    <i className="bi bi-clipboard" />
                  </button>
                  {m.sender === 'user' && (
                    <button className="icon-btn" onClick={() => editMessage(i)} title="Edit">
                      <i className="bi bi-pencil-square" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="elphi-msg ai">
              <div className="bubble">
                <span className="dots"><span></span><span></span><span></span></span>
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
            <i className="bi bi-arrow-up" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ElphiChatWidget;
