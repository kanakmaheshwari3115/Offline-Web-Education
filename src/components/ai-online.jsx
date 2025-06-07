import React, { useState, useEffect, useRef } from 'react';
import { HfInference } from '@huggingface/inference';

const AiOnline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);
  const hf = new HfInference(process.env.REACT_APP_HF_TOKEN);

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { sender: 'User', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await hf.chatCompletion({
        model: 'mistralai/Mistral-7B-Instruct-v0.2', 
        messages: [{ role: 'user', content: input }],
        max_tokens: 100, 
        temperature: 0.5,
      });

      const modelResponse =
        response.choices?.[0]?.message?.content ||
        "I'm sorry, I can't answer that right now.";

      setMessages([...newMessages, { sender: 'AI', text: modelResponse }]);
    } catch (error) {
      console.error('Error al llamar a la API:', error);
      setMessages([
        ...newMessages,
        { sender: 'AI', text: 'Failed to connect to the AI model.' },
      ]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setShowChat(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed bottom-20 right-10 z-10">
      {isOnline && (
        <button
          onClick={() => setShowChat(!showChat)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Chat AI Online
        </button>
      )}

      {showChat && (
        <div
          ref={chatRef}
          className="fixed bottom-8 right-8 w-80 bg-white border border-gray-300 rounded-lg shadow-lg p-4"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Chat AI Online
          </h3>

          <div className="h-48 overflow-y-auto bg-gray-100 rounded-lg p-2 mb-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg ${
                  msg.sender === 'User'
                    ? 'bg-blue-100 text-right'
                    : 'bg-green-100 text-left'
                }`}
              >
                <strong className="block text-sm font-medium">
                  {msg.sender}:
                </strong>
                <span className="text-sm">{msg.text}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message here..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 mr-2"
            />

            <button
              onClick={handleSendMessage}
              className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiOnline;
