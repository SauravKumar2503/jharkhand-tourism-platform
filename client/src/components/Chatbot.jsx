import { useState, useContext, useEffect } from 'react';
import aiService from '../services/aiService';
import AuthContext from '../context/AuthContext';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useContext(AuthContext);

    const getGreeting = () => {
        const userName = user?.user?.name || user?.name || "Traveler";
        const options = ["Plan a trip for me 🗺️", "Best places to visit 🏞️", "Find a local guide 🧑‍🤝‍🧑"];
        if (user) {
            options.push("Load previous chat 📜");
        }
        return {
            text: `Hi ${userName}! I am your Jharkhand Travel Assistant. How can I help you today?`,
            sender: "bot",
            options: options
        };
    };

    const [messages, setMessages] = useState([getGreeting()]);
    const [input, setInput] = useState("");

    // Reset chat on user change (start from scratch)
    useEffect(() => {
        setMessages([getGreeting()]);
    }, [user]);

    const loadHistory = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const history = await aiService.getChatHistory(token);

            if (history && history.length > 0) {
                const formattedHistory = history.map(chat => ({
                    text: chat.message,
                    sender: chat.sender
                }));
                setMessages(prev => {
                    const cleanPrev = prev.map(msg => ({
                        ...msg,
                        options: msg.options ? msg.options.filter(o => o !== "Load previous chat 📜") : null
                    }));
                    return [...formattedHistory, ...cleanPrev];
                });
            } else {
                setMessages(prev => [...prev, { text: "No previous chat history found.", sender: "bot" }]);
            }
        } catch (error) {
            console.error("Error loading chat history:", error);
            setMessages(prev => [...prev, { text: "Failed to load history.", sender: "bot" }]);
        }
    };

    const toggleChat = () => {
        if (!isOpen) {
            setMessages([getGreeting()]);
        }
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (optionText) => {
        if (optionText === "Load previous chat 📜") {
            loadHistory();
        } else {
            handleSend(optionText);
        }
    };

    const handleSend = async (messageText = input) => {
        if (!messageText.trim()) return;

        const userMessage = { text: messageText, sender: "user" };
        setMessages(prev => [...prev, userMessage]);
        setInput("");

        try {
            const token = user ? JSON.parse(localStorage.getItem('user')).token : null;

            if (!token) {
                setTimeout(() => {
                    setMessages(prev => [...prev, { text: "Please login to chat with me!", sender: "bot" }]);
                }, 500);
                return;
            }

            const data = await aiService.chatWithAI(messageText, token, 'English');
            const botMessage = { text: data.response, sender: "bot" };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { text: "Sorry, I am having trouble connecting.", sender: "bot" }]);
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition animate-bounce"
                >
                    💬
                </button>
            )}

            {isOpen && (
                <div className="bg-white w-80 h-[28rem] rounded-lg shadow-xl flex flex-col overflow-hidden animate-fade-in-up">
                    <div className="bg-primary text-white p-3 flex justify-between items-center">
                        <h3 className="font-bold text-sm">Jharkhand AI Assistant</h3>
                        <div className="flex items-center gap-2">
                            <button onClick={toggleChat} className="text-white hover:text-gray-200 text-lg">✕</button>
                        </div>
                    </div>
                    <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
                        {messages.map((msg, index) => (
                            <div key={index} className={`mb-2 flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                <span className={`inline-block p-2 rounded-lg text-sm max-w-xs ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                    {msg.text}
                                </span>
                                {msg.options && (
                                    <div className="mt-2 flex flex-col gap-2">
                                        {msg.options.map((option, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleOptionClick(option)}
                                                className="bg-white border border-secondary text-secondary text-xs px-3 py-1 rounded-full hover:bg-secondary hover:text-white transition text-left"
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="p-3 border-t bg-white flex">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:border-primary text-sm"
                        />
                        <button
                            onClick={() => handleSend()}
                            className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-orange-600 transition"
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
