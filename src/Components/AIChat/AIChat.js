import React, { useState, useEffect, useRef } from 'react';
import './AIChat.css'; // For styling (optional)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';

const Chatbox = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [notifCount, setNotifCount] = useState(0); // State for notification count
    const [header, setHeader] = useState('OEWS Sample Chatbot');
    const [initialMessageSent, setInitialMessageSent] = useState(false); // Track initial message state
    const location = useLocation();
    const chatWindowRef = useRef(null); // Ref for chat window
  
    // Handle sending message
    const handleSendMessage = async () => {
      if (!userInput.trim()) return;
  
      const newUserMessage = { sender: 'user', text: userInput };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
      setUserInput('');
  
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userInput }),
        });
  
        if (!response.ok) throw new Error('Failed to fetch response from server');
  
        const data = await response.json();
        const botMessage = { sender: 'bot', text: data.reply };
  
        setTimeout(() => {
          setMessages((prevMessages) => [...prevMessages, botMessage]);
        }, 1900);
      } catch (error) {
        console.error('Error:', error);
        const errorMessage = { sender: 'bot', text: 'Sorry, something went wrong.' };
        setTimeout(() => {
          setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }, 1000);
      }
    };
  
    // Scroll chat window to the bottom on message update
    useEffect(() => {
      if (chatWindowRef.current) {
        chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
      }
    }, [messages]);
  
    // Send the initial message if not already sent
    const sendInitialMessage = () => {
      if (!initialMessageSent) {
        setNotifCount(1); // Update notification to 1
        setHeader('You have a new message!');
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: 'Hello, how can I help you today?' },
        ]);
        setInitialMessageSent(true); // Mark the message as sent
      }
    };
  
    // Schedule the initial message to send after 8 seconds if not already opened
    useEffect(() => {
      const timer = setTimeout(() => sendInitialMessage(), 8000);
      return () => clearTimeout(timer); // Cleanup timer on component unmount
    }, []);
  
    // Toggle chat open/close and handle reset of header/notifCount
    const toggleChat = () => {
      setIsChatOpen((prev) => {
        const newState = !prev;
  
        // Reset header and notifCount when chat is closed
        if (!newState) {
          setHeader('OEWS Sample Chatbot');
          setNotifCount(0);
        }
  
        return newState;
      });
  
      if (!isChatOpen) sendInitialMessage(); // Send initial message on opening
    };
  
    return (
      <div
        className={`chat-container ${
          location.pathname === '/Find%20Listings%20%7C%20Property%20Search' ? 'gonne' : ''
        } ${isChatOpen ? 'open' : 'closed'}`}
      >
        <div className="bannerMan" onClick={toggleChat}>
          <div className="AIBanner">{header}</div>
          <div className="chevyAI">
            <div className="notif">{notifCount}</div>
            <div className="minchev">
              <FontAwesomeIcon icon={faChevronDown} size="lg" style={{ color: 'white' }} />
            </div>
          </div>
        </div>
  
        {isChatOpen && (
          <>
            <div className="chat-window" ref={chatWindowRef}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.sender}`}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              ))}
            </div>
  
            <div className="chat-input">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        )}
      </div>
    );
  };
  
  export default Chatbox;
  
