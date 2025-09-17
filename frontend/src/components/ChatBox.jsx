// src/components/ChatBox.js
import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { FaPaperPlane } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function ChatBox({ courseId }) {
  const socket = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!socket) return;

    // Join the course-specific chat room
    socket.emit('joinRoom', courseId);

    // Listen for incoming messages
    const messageListener = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    socket.on('receiveMessage', messageListener);

    // Cleanup on component unmount
    return () => {
      socket.off('receiveMessage', messageListener);
    };
  }, [socket, courseId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      const messageData = {
        courseId,
        message: newMessage,
        sender: {
          _id: user._id,
          name: user.name,
          avatar: user.avatar,
        },
      };
      socket.emit('sendMessage', messageData);
      setNewMessage('');
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <header className="p-4 border-b dark:border-gray-700">
        <h3 className="font-bold text-lg text-gray-800 dark:text-white">Live Q&A</h3>
      </header>

      <div className="flex-1 p-4 overflow-y-auto">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex items-start gap-3 my-4 ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender._id !== user._id && (
                <img src={msg.sender.avatar} alt={msg.sender.name} className="w-8 h-8 rounded-full object-cover" />
              )}
              <div className={`flex flex-col ${msg.sender._id === user._id ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-2 rounded-2xl max-w-xs lg:max-w-md ${msg.sender._id === user._id ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200 text-gray-800 rounded-bl-none'}`}>
                  <p className="text-sm">{msg.message}</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{msg.sender.name}</span>
              </div>
              {msg.sender._id === user._id && (
                <img src={msg.sender.avatar} alt={msg.sender.name} className="w-8 h-8 rounded-full object-cover" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <footer className="p-4 border-t dark:border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button type="submit" className="bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 transition-colors">
            <FaPaperPlane />
          </button>
        </form>
      </footer>
    </div>
  );
}

export default ChatBox;