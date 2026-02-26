/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getConversationMessages,
  sendMessage,
  markMessagesAsRead,
} from "../redux/slices/messageSlice";
import Loader from "../components/Loader";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";

const ConversationPage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const [newMessage, setNewMessage] = useState("");
  const { messages, loading } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.auth);

  const conversationMessages = messages[userId] || [];

  useEffect(() => {
    dispatch(getConversationMessages(userId));
    dispatch(markMessagesAsRead(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    dispatch(sendMessage({ receiver: userId, content: newMessage }));
    setNewMessage("");
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const otherUser = conversationMessages.length > 0
    ? (conversationMessages[0].sender._id === user._id
      ? conversationMessages[0].receiver
      : conversationMessages[0].sender)
    : null;

  if (loading && conversationMessages.length === 0) return <Loader />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

        .cp-root {
          font-family: 'Jost', sans-serif;
          min-height: 100vh;
          background: #f9f5ef;
          display: flex;
          flex-direction: column;
        }

        .cp-header {
          background: linear-gradient(135deg, #1e2a1f 0%, #2d3a2e 100%);
          padding: 20px 2rem;
          display: flex;
          align-items: center;
          gap: 20px;
          position: sticky;
          top: 72px;
          z-index: 40;
        }

        .cp-back {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #7db894;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
          flex-shrink: 0;
        }

        .cp-back:hover { color: #e8d5b0; }

        .cp-header-avatar {
          width: 40px;
          height: 40px;
          background: rgba(74, 124, 89, 0.25);
          border: 1px solid rgba(74, 124, 89, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #e8d5b0;
          flex-shrink: 0;
        }

        .cp-header-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.25rem;
          font-weight: 600;
          color: #e8d5b0;
          line-height: 1;
        }

        .cp-header-status {
          font-size: 0.75rem;
          color: #7db894;
          margin-top: 2px;
        }

        /* Chat window */
        .cp-main {
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
          padding: 0 2rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .cp-messages {
          flex: 1;
          overflow-y: auto;
          padding: 32px 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-height: 50vh;
          max-height: 60vh;
        }

        .cp-empty {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8a7a65;
          font-size: 0.9rem;
          font-weight: 300;
          padding: 60px 0;
        }

        .cp-bubble-wrap {
          display: flex;
        }

        .cp-bubble-wrap.sent { justify-content: flex-end; }
        .cp-bubble-wrap.received { justify-content: flex-start; }

        .cp-bubble {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 0.9rem;
          line-height: 1.5;
          position: relative;
        }

        .cp-bubble.sent {
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          color: #e8d5b0;
          border-bottom-right-radius: 4px;
        }

        .cp-bubble.received {
          background: #fefcf8;
          border: 1px solid rgba(101, 78, 51, 0.12);
          color: #3d2f1e;
          border-bottom-left-radius: 4px;
        }

        .cp-bubble-time {
          font-size: 0.7rem;
          margin-top: 5px;
          text-align: right;
          opacity: 0.65;
        }

        /* Input bar */
        .cp-input-bar {
          background: #fefcf8;
          border-top: 1px solid rgba(101, 78, 51, 0.1);
          padding: 16px 0;
          position: sticky;
          bottom: 0;
        }

        .cp-input-inner {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .cp-input {
          flex: 1;
          background: #f4ede0;
          border: 1px solid rgba(101, 78, 51, 0.15);
          border-radius: 100px;
          padding: 12px 20px;
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          color: #3d2f1e;
          outline: none;
          transition: all 0.2s ease;
        }

        .cp-input::placeholder { color: #a09080; }

        .cp-input:focus {
          border-color: rgba(74, 124, 89, 0.4);
          box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.08);
          background: #fefcf8;
        }

        .cp-send-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          border: none;
          color: #e8d5b0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .cp-send-btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 4px 16px rgba(45, 90, 61, 0.35);
        }

        .cp-send-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>

      <div className="cp-root">
        {/* Header */}
        <div className="cp-header">
          <Link to="/messages" className="cp-back">
            <FaArrowLeft size={12} /> Back
          </Link>
          {otherUser && (
            <>
              <div className="cp-header-avatar">
                {otherUser.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <div className="cp-header-name">{otherUser.name}</div>
                <div className="cp-header-status">Active conversation</div>
              </div>
            </>
          )}
          {!otherUser && (
            <div className="cp-header-name" style={{ color: "#8a7a65" }}>Conversation</div>
          )}
        </div>

        {/* Messages */}
        <div className="cp-main">
          <div className="cp-messages">
            {conversationMessages.length > 0 ? (
              <>
                {conversationMessages.map((message) => {
                  const isSent = message.sender._id === user._id;
                  return (
                    <div key={message._id} className={`cp-bubble-wrap ${isSent ? "sent" : "received"}`}>
                      <div className={`cp-bubble ${isSent ? "sent" : "received"}`}>
                        <p>{message.content}</p>
                        <p className="cp-bubble-time">{formatTime(message.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className="cp-empty">No messages yet. Start the conversation!</div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="cp-input-bar">
          <form onSubmit={handleSendMessage} className="cp-input-inner">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="cp-input"
              placeholder="Type a message..."
            />
            <button type="submit" className="cp-send-btn" disabled={newMessage.trim() === ""}>
              <FaPaperPlane size={14} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ConversationPage;