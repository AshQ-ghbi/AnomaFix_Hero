/**
 * Ambient Gemini AI Floating Citizen Assistant Chat Widget
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, MessageSquare, Send, Bot, User, ArrowRight, CornerDownLeft } from 'lucide-react';
import { supabase } from './utils/supabase';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export default function GeminiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Hi! I am AnomaFix AI, your Hyperlocal Citizen Assistant. Ask me anything about reporting street problems, city regulations, earning badges, or community volunteering challenges!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const SUGGESTED_QUESTIONS = [
    "How do I earn community levels?",
    "What department handles water main leaks?",
    "How does automatic AI severity scoring work?"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const newMsg: Message = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: messages.map(m => ({
            role: m.sender === 'ai' ? 'model' : 'user',
            parts: [{ text: m.text }]
          }))
        })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();

      setMessages(prev => [...prev, {
        sender: 'ai',
        text: data.text || "Sorry, I lost connection to the municipal core. Please retry.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      console.error('Chat widget error:', err);
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: "I am having trouble routing this request. Please check that you configured your GEMINI_API_KEY inside the AI Studio Secrets panel.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="gemini-chat-widget">
      {/* Floating Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[360px] max-w-[calc(100vw-32px)] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          
          {/* Obsidian Gradient Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="bg-blue-500/20 p-1.5 rounded-lg border border-blue-400/30">
                <Sparkles className="h-4 w-4 text-blue-400 animate-pulse fill-blue-400/20" />
              </div>
              <div>
                <h3 className="font-semibold text-sm tracking-wide">AnomaFix Civic AI</h3>
                <span className="text-[10px] text-blue-300 font-medium tracking-wider uppercase">Citizen Assistant</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div 
            ref={scrollRef}
            className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50"
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar Icon */}
                <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 border shadow-xs ${
                  m.sender === 'ai' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-800 border-slate-700 text-slate-100'
                }`}>
                  {m.sender === 'ai' ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                </div>

                {/* Bubble Text */}
                <div className="flex flex-col">
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                    m.sender === 'ai' 
                      ? 'bg-white text-slate-700 rounded-tl-none border border-slate-100' 
                      : 'bg-blue-600 text-white rounded-tr-none'
                  }`}>
                    {m.text}
                  </div>
                  <span className={`text-[9px] text-slate-400 mt-1 px-1 ${m.sender === 'user' ? 'text-right' : ''}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {/* AI Typing Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 mr-auto max-w-[85%]">
                <div className="h-7 w-7 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-slate-100 flex items-center gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions Row */}
          {messages.length === 1 && (
            <div className="p-3 bg-white border-t border-slate-50 flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Suggested Questions</span>
              {SUGGESTED_QUESTIONS.map((q, qIdx) => (
                <button
                  key={qIdx}
                  onClick={() => handleSendMessage(q)}
                  className="text-left text-xs bg-slate-50 hover:bg-blue-50/70 hover:text-blue-700 text-slate-600 px-3 py-1.5 rounded-xl transition-all border border-slate-100 flex items-center justify-between group"
                >
                  <span>{q}</span>
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all" />
                </button>
              ))}
            </div>
          )}

          {/* Input Panel */}
          <div className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(message)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
            />
            <button
              onClick={() => handleSendMessage(message)}
              disabled={!message.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-2.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 rounded-full p-4 flex items-center gap-2 border border-blue-500/10 cursor-pointer group active:scale-95 transition-all"
      >
        <Sparkles className="h-5 w-5 animate-pulse fill-white/10" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-28 transition-all duration-300 font-semibold text-sm tracking-wide">
          AI Assistant
        </span>
      </button>
    </div>
  );
}
