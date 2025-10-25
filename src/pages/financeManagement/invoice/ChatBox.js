import React, { useState, useEffect, useRef } from 'react';
import { domainName } from '../../../constents/global';
import { useDispatch, useSelector } from 'react-redux';
import { invoiceComentCreate, invoiceComentList } from './invoiceFeature/_invoice_reducers';

const CommentBox = ({ data, status, isOpen, onToggle }) => {
    const [newMessage, setNewMessage] = useState('');
    const dispatch = useDispatch();
    const { invoiceCopmmentListData } = useSelector(state => state?.invoice);
    const [currentUserId, setCurrentUserId] = useState(null);
    const chatBoxRef = useRef(null);
    const messagesEndRef = useRef(null);

    const fetchMessageList = () => {
        dispatch(invoiceComentList({ _id: data?._id }));
    };

    const onSendMessage = (message) => {
        dispatch(invoiceComentCreate({
            _id: data?._id,
            message: message.text || '',
            attachment: message.attachment || ''
        })).then(() => {
            fetchMessageList();
        });
    };

    useEffect(() => {
        const userInfoglobal = JSON.parse(
            localStorage.getItem(`user_info_${domainName}`)
        );
        setCurrentUserId(userInfoglobal?._id);
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchMessageList();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [invoiceCopmmentListData, isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && chatBoxRef.current && !chatBoxRef.current.contains(event.target)) {
                onToggle();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onToggle]);

    const handleSend = () => {
        if (!newMessage.trim()) return;
        onSendMessage({ text: newMessage });
        setNewMessage('');
    };

    const formatDateTime = (date) => {
        const d = new Date(date);
        return d.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getFileUrl = (file) => {
        return `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`;
    };

    const messages = invoiceCopmmentListData?.data || [];

    return (
        <>
            <div
                className={`fixed bottom-4 right-4 z-50 transition-all duration-300 transform ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
                    }`}
            >
                <div
                    ref={chatBoxRef}
                    className="w-[350px] max-h-[500px] bg-white shadow-xl rounded-lg flex flex-col border border-gray-300"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center px-4 py-2 bg-[#074173] text-white font-semibold rounded-t-lg">
                        <span>Comments</span>
                        <button
                            onClick={onToggle}
                            className="text-white hover:text-gray-200 text-sm"
                            title="Close comment box"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Comments */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-white">
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-400 text-sm">No comments yet.</div>
                        ) : (
                            messages.map((msg, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded border">
                                    <div className="text-sm font-medium text-gray-700">
                                        {msg.commentedByName || 'Unknown'}
                                    </div>
                                    {msg.message && (
                                        <div className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">
                                            {msg.message}
                                        </div>
                                    )}
                                    {msg.attachment && (
                                        <a
                                            href={getFileUrl(msg.attachment)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 text-xs mt-1 block underline break-words"
                                        >
                                            📎 Attachment
                                        </a>
                                    )}
                                    <div className="text-[11px] text-gray-500 mt-1">
                                        {msg.date ? formatDateTime(msg.date) : ''}
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    {status === 'PendingPayment' && (
                        <div className="p-2 border-t border-gray-200 bg-white">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    className="flex-1 px-3 py-1 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-200"
                                    placeholder="Write a comment..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button
                                    onClick={handleSend}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CommentBox;
