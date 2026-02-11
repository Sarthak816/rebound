import { useState } from 'react';
import { Bell, X, MessageSquare } from 'lucide-react';

const NotificationBell = ({ messages = [] }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const unreadCount = messages.filter(m => !m.read).length;

    // Demo messages for hackathon
    const demoMessages = messages.length > 0 ? messages : [
        {
            _id: '1',
            from: 'Dr. Emily Roberts',
            subject: 'Check-in',
            message: 'Hi! I noticed your stress levels have been high lately. Let\'s schedule a quick chat to discuss how I can support you.',
            type: 'check-in',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            read: false
        },
        {
            _id: '2',
            from: 'Prof. James Wilson',
            subject: 'Great Progress!',
            message: 'I\'m really impressed with your recent assignment submission. Keep up the excellent work!',
            type: 'message',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            read: true
        }
    ];

    const formatTime = (timestamp) => {
        const now = new Date();
        const diff = now - new Date(timestamp);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        return 'Just now';
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'check-in': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'intervention': return 'bg-red-50 border-red-200 text-red-800';
            default: return 'bg-blue-50 border-blue-200 text-blue-800';
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 rounded-lg bg-academic-100 text-academic-700 hover:bg-academic-200 transition-all hover:scale-110"
                aria-label="Notifications"
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-academic-200 z-20 max-h-96 overflow-y-auto">
                        <div className="p-3 border-b border-academic-200 flex items-center justify-between sticky top-0 bg-white">
                            <h3 className="font-semibold text-academic-900">Messages</h3>
                            <button
                                onClick={() => setShowDropdown(false)}
                                className="text-academic-400 hover:text-academic-600"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {demoMessages.length === 0 ? (
                            <div className="p-6 text-center text-academic-500">
                                <MessageSquare className="mx-auto mb-2 opacity-50" size={32} />
                                <p className="text-sm">No messages yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-academic-100">
                                {demoMessages.map((msg) => (
                                    <div
                                        key={msg._id}
                                        className={`p-3 hover:bg-academic-50 transition-colors ${!msg.read ? 'bg-blue-50/30' : ''
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-1">
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-academic-900">
                                                    {msg.from}
                                                </p>
                                                <p className="text-xs text-academic-500">
                                                    {formatTime(msg.timestamp)}
                                                </p>
                                            </div>
                                            <span className={`text-xs px-2 py-0.5 rounded border ${getTypeColor(msg.type)}`}>
                                                {msg.type}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-academic-800 mb-1">
                                            {msg.subject}
                                        </p>
                                        <p className="text-xs text-academic-600 line-clamp-2">
                                            {msg.message}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {demoMessages.length > 0 && (
                            <div className="p-2 border-t border-academic-200 bg-academic-50">
                                <button className="w-full text-sm text-sage-700 hover:text-sage-900 font-medium py-1">
                                    View All Messages
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationBell;
