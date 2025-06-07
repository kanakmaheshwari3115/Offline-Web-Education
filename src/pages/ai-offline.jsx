import React, { useEffect, useRef, useState } from 'react';
import * as qna from '@tensorflow-models/qna';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import * as tf from '@tensorflow/tfjs-core';
import subjects from '../data/subjects';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

const driverObj = driver({
  showProgress: true,
  steps: [
    {
      element: '#chat-ai',
      popover: {
        title: 'Chat-AI',
        description: 'Interact with the AI-powered chat to ask questions or get help with your content.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#show-passage',
      popover: {
        title: 'Show passage',
        description: 'Click here to display the relevant passage or content for reference.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#question',
      popover: {
        title: 'Make a question',
        description: 'Type your question here to interact with the AI and receive an answer.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#send',
      popover: {
        title: 'Send the question',
        description: 'Submit your question to receive a response from the AI.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#ELA',
      popover: {
        title: 'English Language Arts (ELA)',
        description: 'Explore resources and ask questions related to English Language Arts.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#maths',
      popover: {
        title: 'Mathematics',
        description: 'Access and engage with educational materials for Mathematics.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#history',
      popover: {
        title: 'History',
        description: 'Learn more about historical events and ask questions about history topics.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#help',
      popover: {
        title: 'Help',
        description: 'Need assistance? Click here to access help or support resources.',
        side: 'left',
        align: 'start',
      },
    },
  ],
});

export function AiOffline() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [error, setError] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const endOfMessagesRef = useRef(null);
  const [subjID, setSubjId] = useState(0);
  const [activeSubjId, setActiveSubjId] = useState(0);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const subject = subjects[subjID]?.name || '';
  const passage = subjects[subjID]?.content || '';

  useEffect(() => {
    let isMounted = true;
    const loadModel = async () => {
      if (model) return;
      setLoading(true);
      try {
        const loadedModel = await qna.load({
          modelUrl: '/models/mobilebert/model.json',
          vocabUrl: '/models/mobilebert/processed_vocab.json',
        });
        if (isMounted) setModel(loadedModel);
      } catch (err) {
        setError('Failed to load model');
      } finally {
        if (isMounted) setLoading(false);
        showSnackbar();
      }
    };
    loadModel();

    return () => {
      isMounted = false;
      if (model) {
        model.dispose();
        tf.engine().disposeVariables();
      }
    };
  }, []);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleFindAnswer = async (question) => {
    if (!model) {
      setError('Model not loaded');
      return [];
    }
    try {
      const answers = await model.findAnswers(question, passage);
      return answers || [];
    } catch (err) {
      setError('Error finding answer');
      return [];
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setLoading(true);
    const answers = await handleFindAnswer(input);
    const aiResponse = {
      text: answers.length ? answers[0].text : 'No answer found.',
      sender: 'ai',
    };
    setMessages((prev) => [...prev, aiResponse]);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  const showSnackbar = () => {
    setSnackbarVisible(true);
    setTimeout(() => setSnackbarVisible(false), 5000);
  };

  const closeSnackbar = () => {
    setSnackbarVisible(false);
  };

  return (
    <div className="flex">
      <div
        className={`bg-white shadow-lg transition-transform duration-300 ease-in-out transform ${
          sidebarVisible ? 'translate-x-0' : '-translate-x-full'
        } w-80 h-full fixed top-0 left-0 z-20 p-6 rounded-r-lg border-l border-gray-300`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">{subject}</h2>
          <button
            onClick={toggleSidebar}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            X
          </button>
        </div>
        <div className="overflow-y-scroll h-[80%]">
          <p className="text-gray-700">{passage}</p>
        </div>
      </div>

      <nav
        id="sidebar"
        className={`fixed bottom-0 w-full md:w-auto md:left-6 md:top-1/2 md:-translate-y-1/2 md:flex md:flex-col md:gap-4 md:rounded-lg bg-white/50 shadow-lg border p-2.5 transition-all duration-300 ease-in-out ${
          sidebarVisible ? 'ml-80' : 'ml-0'
        }`}
      >
        {['ELA', 'Maths', 'History'].map((label, index) => (
          <a
            key={label}
            id={label.toLowerCase()}
            onClick={() => {
              toggleSidebar();
              setSubjId(index);
              setActiveSubjId(index);
            }}
            className={`flex aspect-square cursor-pointer w-16 flex-col items-center justify-center gap-1 rounded-md p-1.5 ${
              activeSubjId === index
                ? 'bg-indigo-50 text-indigo-600 dark:bg-sky-900 dark:text-sky-50'
                : 'text-black dark:bg-gray-800 dark:text-white'
            }`}
          >
            <span className="text-xs font-medium">{label}</span>
          </a>
        ))}
      </nav>

      <div className="flex flex-col w-full p-4 ml-0 md:ml-80">
        <div id="chat-ai" className="flex-1 overflow-y-auto max-h-[75vh]">
          {messages.map((msg, i) => (
            <div key={i} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <span
                className={`inline-block px-4 py-2 rounded-lg ${
                  msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
          <div ref={endOfMessagesRef}></div>
        </div>
        <div className="mt-4 flex gap-2 items-center">
          <input
            id="question"
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-lg"
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            id="send"
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
        {loading && <p className="text-sm text-gray-500 mt-2">AI is thinking...</p>}
      </div>

      {snackbarVisible && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
          AI Model Loaded Successfully
          <button onClick={closeSnackbar} className="ml-4 text-white font-bold">X</button>
        </div>
      )}
    </div>
  );
}
