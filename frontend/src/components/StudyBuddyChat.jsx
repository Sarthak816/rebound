import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Loader2, Bot, User } from 'lucide-react';
import api from '../utils/api';

const StudyBuddyChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi! I'm your AI Study Buddy. I can help you with study strategies, task prioritization, stress management, and more. How can I help you today?"
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');

        // Add user message
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const res = await api.post('/student/chat', { message: userMessage });

            // Add AI response
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: res.data.response
            }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm having trouble connecting right now. Please try again in a moment."
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 bg-gradient-to-r from-sage-600 to-sage-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-50 flex items-center gap-2"
                    aria-label="Open Study Buddy"
                >
                    <Bot size={24} />
                    <span className="font-medium">Study Buddy</span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-academic-200 flex flex-col z-50 animate-fadeIn">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-sage-600 to-sage-700 text-white p-4 rounded-t-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bot size={24} />
                            <div>
                                <h3 className="font-semibold">AI Study Buddy</h3>
                                <p className="text-xs text-sage-100">Always here to help</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-sage-800 p-1 rounded transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-academic-50">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full bg-sage-600 flex items-center justify-center flex-shrink-0">
                                        <Bot size={16} className="text-white" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[75%] p-3 rounded-lg ${msg.role === 'user'
                                            ? 'bg-sage-600 text-white rounded-br-none'
                                            : 'bg-white border border-academic-200 rounded-bl-none'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-academic-600 flex items-center justify-center flex-shrink-0">
                                        <User size={16} className="text-white" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div className="flex gap-2 justify-start">
                                <div className="w-8 h-8 rounded-full bg-sage-600 flex items-center justify-center flex-shrink-0">
                                    <Bot size={16} className="text-white" />
                                </div>
                                <div className="bg-white border border-academic-200 p-3 rounded-lg rounded-bl-none">
                                    <Loader2 className="animate-spin text-sage-600" size={16} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-academic-200 bg-white rounded-b-lg">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me anything about studying..."
                                className="flex-1 p-2 border border-academic-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent text-sm"
                                disabled={loading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                className="bg-sage-600 text-white p-2 rounded-lg hover:bg-sage-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                        <p className="text-xs text-academic-500 mt-2">
                            💡 Try asking about study tips, task prioritization, or stress management
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudyBuddyChat;
