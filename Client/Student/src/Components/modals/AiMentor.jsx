import React, { useState, useEffect, useRef } from 'react';

export default function AiMentor() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your Ghumakkad Go mentor. How can I help with your studies today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Keeps the chat pinned to the most recent message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    
    // 1. Update UI immediately with user message
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 2. Real API call to your backend
      const response = await fetch('/api/ai/chatbot/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // We send the whole history so the AI has context of the conversation
        body: JSON.stringify({ 
          message: input,
          history: messages 
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // 3. Update UI with AI response
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: data.answer || "I'm sorry, I couldn't process that. Could you try again?" 
      }]);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting to my brain right now. Please check your connection." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>Ghumakkad Go AI Mentor</h2>
        <span style={styles.status}>{isLoading ? '● Mentor is typing...' : '● Online'}</span>
      </header>

      <div style={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div key={index} style={msg.role === 'user' ? styles.userRow : styles.aiRow}>
            <div style={msg.role === 'user' ? styles.userBubble : styles.aiBubble}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <div style={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about math, science, or history..."
          style={styles.input}
          disabled={isLoading}
        />
        <button 
          onClick={handleSend} 
          style={{...styles.button, opacity: isLoading ? 0.6 : 1}}
          disabled={isLoading}
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { 
    maxWidth: '700px', 
    margin: '40px auto', 
    border: '1px solid #e0e0e0', 
    borderRadius: '12px', 
    display: 'flex', 
    flexDirection: 'column', 
    height: '75vh',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    fontFamily: 'system-ui, sans-serif'
  },
  header: { 
    padding: '15px 20px', 
    background: '#ffffff', 
    borderBottom: '1px solid #eee', 
    display: 'flex', 
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '12px 12px 0 0'
  },
  title: { margin: 0, fontSize: '1.2rem', color: '#333' },
  status: { fontSize: '0.8rem', color: '#4caf50' },
  chatWindow: { 
    flex: 1, 
    overflowY: 'auto', 
    padding: '20px', 
    background: '#f9f9f9',
    display: 'flex',
    flexDirection: 'column'
  },
  userRow: { display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' },
  aiRow: { display: 'flex', justifyContent: 'flex-start', marginBottom: '15px' },
  userBubble: { 
    background: '#007bff', 
    color: 'white', 
    padding: '12px 16px', 
    borderRadius: '18px 18px 2px 18px', 
    maxWidth: '80%',
    lineHeight: '1.4'
  },
  aiBubble: { 
    background: '#ffffff', 
    color: '#333', 
    padding: '12px 16px', 
    borderRadius: '18px 18px 18px 2px', 
    maxWidth: '80%',
    border: '1px solid #eee',
    lineHeight: '1.4'
  },
  inputArea: { display: 'flex', padding: '15px', background: '#fff', borderTop: '1px solid #eee' },
  input: { 
    flex: 1, 
    padding: '12px', 
    borderRadius: '25px', 
    border: '1px solid #ddd', 
    outline: 'none',
    fontSize: '1rem'
  },
  button: { 
    marginLeft: '10px', 
    padding: '0 20px', 
    background: '#28a745', 
    color: 'white', 
    border: 'none', 
    borderRadius: '25px', 
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};