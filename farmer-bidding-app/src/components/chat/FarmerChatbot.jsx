// src/components/chat/FarmerChatbot.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic } from 'lucide-react';

const FarmerChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en-IN');
  const [isApiSupported, setIsApiSupported] = useState(false);
  const recognitionRef = useRef(null);
  const voicesRef = useRef([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setIsApiSupported(true);
    }
    const loadVoices = () => { voicesRef.current = window.speechSynthesis.getVoices(); };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const speak = (text, lang) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    const voice = voicesRef.current.find(v => v.lang === lang);
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };
  
  const handleSend = async (messageText = input) => {
    if (messageText.trim() === '' || isLoading) return;
    const userMessage = { role: 'user', content: messageText };
    let newMessages = [...messages, userMessage];
    let languageInstruction = '';
    if (language === 'mr-IN') languageInstruction = "Please respond in Marathi.";
    else if (language === 'hi-IN') languageInstruction = "Please respond in Hindi.";
    const messagesForApi = newMessages.map((msg, index) => 
        index === newMessages.length - 1 
        ? { ...msg, content: `${languageInstruction}\n\n${msg.content}` }
        : msg
    );
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: messagesForApi }) });
      if (!response.ok) throw new Error('Server error');
      const data = await response.json();
      if (!data || !data.response) throw new Error('Invalid response from AI');
      setMessages(prev => [...prev, data.response]);
      speak(data.response.content, language);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorContent = 'Sorry, I encountered an error. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: errorContent }]);
      speak(errorContent, language);
    }
    setIsLoading(false);
  };

  const handleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = language;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => console.error('Speech recognition error:', event.error);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };
    recognition.start();
  };
  
  useEffect(() => {
    let welcomeMessage = 'Hello! How can I help you with your farm today?';
    if (language === 'mr-IN') welcomeMessage = 'नमस्कार! आज मी तुमच्या शेतीसाठी कशी मदत करू शकते?';
    else if (language === 'hi-IN') welcomeMessage = 'नमस्ते! आज मैं आपके खेत के लिए आपकी क्या मदद कर सकता हूँ?';
    setMessages([{ role: 'assistant', content: welcomeMessage }]);
    speak(welcomeMessage, language);
  }, [language]);


  return (
    // STYLE UPDATE: Main container with a softer background and shadow
    <div className="flex flex-col h-[70vh] max-w-3xl mx-auto bg-stone-50 rounded-xl shadow-lg overflow-hidden border border-stone-200">
      
      {/* STYLE UPDATE: Cleaner header with language selector */}
      <div className="p-2 border-b bg-white flex justify-between items-center">
        <p className="text-sm font-semibold text-stone-500 ml-2">AI Assistant</p>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="border-stone-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500">
            <option value="en-IN">English</option>
            <option value="hi-IN">हिन्दी (Hindi)</option>
            <option value="mr-IN">मराठी (Marathi)</option>
        </select>
      </div>

      <div className="flex-grow p-6 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {/* STYLE UPDATE: New bubble styles for a more organic feel */}
            <div className={`py-2 px-4 max-w-[80%] whitespace-pre-wrap shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-green-600 text-white rounded-t-2xl rounded-bl-2xl' 
                  : 'bg-stone-200 text-stone-800 rounded-t-2xl rounded-br-2xl'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="py-2 px-4 rounded-2xl bg-stone-200 flex items-center space-x-1">
              {/* STYLE UPDATE: Adjusted loading dots */}
              <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* STYLE UPDATE: Cleaner input bar with redesigned buttons */}
      <div className="flex items-center p-2 border-t bg-white">
        <input
          type="text" value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          className="flex-grow border-none focus:ring-0 p-2 bg-transparent text-stone-800 placeholder-stone-400"
        />
        {isApiSupported && (
          <button 
            onClick={handleListen} 
            title={isListening ? "Stop listening" : "Speak your question"}
            className={`rounded-full w-10 h-10 flex items-center justify-center transition-all flex-shrink-0 mx-2 ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
        <button 
          onClick={() => handleSend()} 
          disabled={isLoading || !input}
          title="Send message"
          className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FarmerChatbot;