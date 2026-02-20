import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api/api';
import './ChatBot.css';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import { BsChatDotsFill } from 'react-icons/bs';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi there! 👋 I'm developed by Hariprasath (Email: hsriprasath24r@gmail.com, Mobile: +91-8015894119). What is your name?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Add user message
        const newMessage = {
            id: messages.length + 1,
            text: inputValue,
            sender: 'user'
        };

        setMessages(prev => [...prev, newMessage]);
        const currentInput = inputValue.trim();
        setInputValue("");

        if (step === 0) {
            setUserName(currentInput);
            setStep(1);
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                text: `Nice to meet you, ${currentInput}! Could you please provide your email address?`,
                sender: 'bot'
            }]);
            return;
        }

        if (step === 1) {
            setUserEmail(currentInput);
            setStep(2);
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                text: "Thanks! Where would you like to explore today? You can type 'PC', 'Mobile', or 'Accessories'.",
                sender: 'bot'
            }]);

            // Save user info silently in the background
            try {
                api.post('/api/chat/user', { name: userName, email: currentInput })
                    .catch(err => console.error("Failed to save user:", err));
            } catch (err) {
                console.error("Failed to save user:", err);
            }

            return;
        }

        if (step === 2) {
            const dest = currentInput.toLowerCase();
            if (dest.includes('pc')) {
                navigate('/pc');
                setStep(3);
                setMessages(prev => [...prev, { id: prev.length + 1, text: "Navigating to PC section... Let me know if you need anything else!", sender: 'bot' }]);
                return;
            } else if (dest.includes('mobile') || dest.includes('phone')) {
                navigate('/mobile');
                setStep(3);
                setMessages(prev => [...prev, { id: prev.length + 1, text: "Navigating to Mobile section... Let me know if you need anything else!", sender: 'bot' }]);
                return;
            } else if (dest.includes('access')) {
                navigate('/accessories');
                setStep(3);
                setMessages(prev => [...prev, { id: prev.length + 1, text: "Navigating to Accessories section... Let me know if you need anything else!", sender: 'bot' }]);
                return;
            } else {
                setMessages(prev => [...prev, { id: prev.length + 1, text: "I didn't quite catch that. Please type 'PC', 'Mobile', or 'Accessories'.", sender: 'bot' }]);
                return;
            }
        }

        // Send message to backend
        try {
            const response = await fetch('http://localhost:8080/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: inputValue }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            const botResponse = {
                id: messages.length + 2,
                text: data.response, // Using the response field from map
                sender: 'bot'
            };
            setMessages(prev => [...prev, botResponse]);

        } catch (error) {
            console.error("Error sending message:", error);
            const errorResponse = {
                id: messages.length + 2,
                text: "Sorry, I'm having trouble connecting to the server. Please try again later.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, errorResponse]);
        }
    };

    return (
        <div className="chatbot-container">
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h3>TopCart Assistant</h3>
                        <button className="close-btn" onClick={toggleChat}>
                            <FaTimes />
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chatbot-input" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button type="submit">
                            <FaPaperPlane size={14} />
                        </button>
                    </form>
                </div>
            )}

            <button className="chatbot-toggle" onClick={toggleChat}>
                {isOpen ? <FaTimes /> : <BsChatDotsFill size={24} />}
            </button>
        </div>
    );
};

export default ChatBot;
