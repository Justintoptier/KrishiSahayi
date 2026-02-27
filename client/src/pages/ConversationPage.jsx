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

// ─── helpers ────────────────────────────────────────────────────────────────

/** Always returns the plain string _id from whatever shape sender/receiver is */
const getId = (field) => {
  if (!field) return null;
  if (typeof field === "object" && field._id) return String(field._id);
  return String(field);
};

/** Safe timestamp → locale time, returns "" if invalid */
const fmtTime = (ts) => {
  if (!ts) return "";
  const d = new Date(ts);
  if (isNaN(d)) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

/** Safe timestamp → date group label */
const fmtDateLabel = (ts) => {
  if (!ts) return "Unknown";
  const d = new Date(ts);
  if (isNaN(d)) return "Unknown";
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "long", day: "numeric" });
};

// ─── component ──────────────────────────────────────────────────────────────

const ConversationPage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const [newMessage, setNewMessage] = useState("");
  const { messages, loading } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.auth);
  const myId = String(user?._id);

  const conversationMessages = messages[userId] || [];

  useEffect(() => {
    dispatch(getConversationMessages(userId));
    dispatch(markMessagesAsRead(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    dispatch(sendMessage({ receiver: userId, content: newMessage }));
    setNewMessage("");
  };

  /** TRUE if this message was sent by the logged-in user */
  const isMine = (msg) => getId(msg.sender) === myId;

  /** Find the other person's user object (populated or fallback) */
  const otherUser = (() => {
    for (const msg of conversationMessages) {
      if (!isMine(msg) && typeof msg.sender === "object" && msg.sender?.name) {
        return msg.sender;
      }
    }
    for (const msg of conversationMessages) {
      if (isMine(msg) && typeof msg.receiver === "object" && msg.receiver?.name) {
        return msg.receiver;
      }
    }
    return null;
  })();

  // Group by date
  const grouped = conversationMessages.reduce((acc, msg) => {
    const label = fmtDateLabel(msg.createdAt);
    if (!acc[label]) acc[label] = [];
    acc[label].push(msg);
    return acc;
  }, {});

  if (loading && conversationMessages.length === 0) return <Loader />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }

        .cp-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          margin-top: 72px;
          height: calc(100vh - 72px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #0f1a10;
        }

        /* HEADER */
        .cp-header {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 28px; flex-shrink: 0;
          background: rgba(15,26,16,0.97);
          border-bottom: 1px solid rgba(74,124,89,0.15);
          position: relative; z-index: 10;
        }
        .cp-header::after {
          content:''; position:absolute; bottom:0; left:0; right:0; height:1px;
          background: linear-gradient(90deg,transparent,rgba(74,124,89,0.5),transparent);
        }
        .cp-back {
          display:flex; align-items:center; justify-content:center;
          width:34px; height:34px; border-radius:10px;
          background:rgba(74,124,89,0.12); border:1px solid rgba(74,124,89,0.2);
          color:#7db894; text-decoration:none; transition:all 0.2s; flex-shrink:0;
        }
        .cp-back:hover { background:rgba(74,124,89,0.25); color:#a8d5b5; transform:translateX(-2px); }

        .cp-avatar {
          width:42px; height:42px; border-radius:14px;
          background:linear-gradient(135deg,#4a7c59,#2d5a3d);
          display:flex; align-items:center; justify-content:center;
          font-family:'Cormorant Garamond',serif; font-size:1.2rem; font-weight:700;
          color:#e8d5b0; flex-shrink:0;
          box-shadow:0 4px 12px rgba(45,90,61,0.4); position:relative;
        }
        .cp-avatar::after {
          content:''; position:absolute; bottom:-2px; right:-2px;
          width:11px; height:11px; background:#4ade80; border-radius:50%;
          border:2px solid #0f1a10;
        }
        .cp-header-name {
          font-family:'Cormorant Garamond',serif; font-size:1.2rem;
          font-weight:700; color:#e8d5b0; line-height:1.1;
        }
        .cp-header-status {
          font-size:0.72rem; color:#4ade80; margin-top:2px;
          display:flex; align-items:center; gap:4px; font-weight:500;
        }
        .cp-status-dot {
          width:6px; height:6px; background:#4ade80; border-radius:50%;
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.6; transform:scale(0.8); }
        }

        /* MESSAGES */
        .cp-messages {
          flex:1; overflow-y:auto; padding:24px 28px;
          display:flex; flex-direction:column; gap:2px;
          background:
            radial-gradient(ellipse at 20% 20%,rgba(45,90,61,0.06) 0%,transparent 50%),
            radial-gradient(ellipse at 80% 80%,rgba(74,124,89,0.04) 0%,transparent 50%),
            #111a12;
          scrollbar-width:thin; scrollbar-color:rgba(74,124,89,0.2) transparent;
        }
        .cp-messages::-webkit-scrollbar { width:3px; }
        .cp-messages::-webkit-scrollbar-track { background:transparent; }
        .cp-messages::-webkit-scrollbar-thumb { background:rgba(74,124,89,0.3); border-radius:3px; }

        .cp-spacer { flex:1; min-height:8px; }

        .cp-date-group { display:flex; flex-direction:column; gap:2px; }
        .cp-date-label {
          display:flex; align-items:center; gap:12px;
          margin:16px 0 10px; font-size:0.7rem; font-weight:600;
          color:rgba(125,184,148,0.45); text-transform:uppercase; letter-spacing:0.1em;
        }
        .cp-date-label::before,.cp-date-label::after {
          content:''; flex:1; height:1px;
          background:linear-gradient(90deg,transparent,rgba(74,124,89,0.15),transparent);
        }

        .cp-row { display:flex; align-items:flex-end; gap:8px; margin:1px 0; }
        .cp-row.sent     { flex-direction:row-reverse; }
        .cp-row.received { flex-direction:row; }

        .cp-mini-avatar {
          width:28px; height:28px; border-radius:9px;
          background:linear-gradient(135deg,#2d5a3d,#1e3d2a);
          display:flex; align-items:center; justify-content:center;
          font-family:'Cormorant Garamond',serif; font-size:0.8rem; font-weight:700;
          color:#a8d5b5; flex-shrink:0; margin-bottom:2px;
        }
        .cp-mini-avatar.hidden { visibility:hidden; }

        .cp-bubble {
          max-width:62%; padding:10px 14px; font-size:0.88rem;
          line-height:1.55; word-break:break-word; position:relative;
        }
        .cp-bubble.sent {
          background:linear-gradient(135deg,#4a7c59 0%,#2d5a3d 100%);
          color:#e8f5ec; border-radius:18px 18px 4px 18px;
          box-shadow:0 2px 12px rgba(45,90,61,0.35),inset 0 1px 0 rgba(255,255,255,0.08);
        }
        .cp-bubble.received {
          background:rgba(30,42,31,0.9); border:1px solid rgba(74,124,89,0.15);
          color:#d4e8d8; border-radius:18px 18px 18px 4px;
          box-shadow:0 2px 8px rgba(0,0,0,0.2);
        }
        .cp-bubble.sent::before {
          content:''; position:absolute; inset:0; border-radius:inherit;
          background:linear-gradient(135deg,rgba(255,255,255,0.06),transparent);
          pointer-events:none;
        }
        .cp-time {
          font-size:0.65rem; margin-top:4px;
          text-align:right; opacity:0.55; display:block;
        }

        /* EMPTY */
        .cp-empty {
          flex:1; display:flex; flex-direction:column;
          align-items:center; justify-content:center; gap:12px;
          color:rgba(125,184,148,0.4);
        }
        .cp-empty-icon {
          width:64px; height:64px; border-radius:20px;
          background:rgba(74,124,89,0.08); border:1px solid rgba(74,124,89,0.12);
          display:flex; align-items:center; justify-content:center; font-size:1.8rem;
        }
        .cp-empty-text { font-size:0.85rem; font-weight:500; }

        /* INPUT */
        .cp-input-bar {
          flex-shrink:0; padding:14px 24px 18px;
          background:rgba(15,26,16,0.98); border-top:1px solid rgba(74,124,89,0.1);
        }
        .cp-input-inner {
          display:flex; align-items:center; gap:10px;
          background:rgba(30,42,31,0.8); border:1px solid rgba(74,124,89,0.2);
          border-radius:18px; padding:6px 6px 6px 18px; transition:all 0.25s;
          box-shadow:0 4px 20px rgba(0,0,0,0.2),inset 0 1px 0 rgba(74,124,89,0.08);
        }
        .cp-input-inner:focus-within {
          border-color:rgba(74,124,89,0.5);
          box-shadow:0 4px 24px rgba(0,0,0,0.25),0 0 0 3px rgba(74,124,89,0.1);
          background:rgba(30,42,31,0.95);
        }
        .cp-input {
          flex:1; background:transparent; border:none; outline:none;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:0.9rem;
          color:#d4e8d8; padding:8px 0; caret-color:#7db894;
        }
        .cp-input::placeholder { color:rgba(125,184,148,0.3); }
        .cp-send-btn {
          width:40px; height:40px; border-radius:12px; border:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
          transition:all 0.2s; background:linear-gradient(135deg,#4a7c59,#2d5a3d);
          color:#e8f5ec; box-shadow:0 2px 8px rgba(45,90,61,0.4);
        }
        .cp-send-btn:hover:not(:disabled) { transform:scale(1.08); box-shadow:0 4px 16px rgba(45,90,61,0.6); }
        .cp-send-btn:active:not(:disabled) { transform:scale(0.95); }
        .cp-send-btn:disabled { background:rgba(74,124,89,0.15); color:rgba(125,184,148,0.3); box-shadow:none; cursor:not-allowed; }

        @keyframes bubble-in-sent     { from{opacity:0;transform:translateX(12px) scale(0.95)} to{opacity:1;transform:none} }
        @keyframes bubble-in-received { from{opacity:0;transform:translateX(-12px) scale(0.95)} to{opacity:1;transform:none} }
        .cp-row.sent .cp-bubble     { animation:bubble-in-sent 0.22s ease-out; }
        .cp-row.received .cp-bubble { animation:bubble-in-received 0.22s ease-out; }
      `}</style>

      <div className="cp-root">

        {/* Header */}
        <div className="cp-header">
          <Link to="/messages" className="cp-back"><FaArrowLeft size={13} /></Link>
          {otherUser ? (
            <>
              <div className="cp-avatar">{otherUser.name?.[0]?.toUpperCase() || "?"}</div>
              <div>
                <div className="cp-header-name">{otherUser.name}</div>
                <div className="cp-header-status"><span className="cp-status-dot" /> Online</div>
              </div>
            </>
          ) : (
            <div className="cp-header-name" style={{ color: "rgba(232,213,176,0.5)" }}>Conversation</div>
          )}
        </div>

        {/* Messages */}
        <div className="cp-messages">
          {conversationMessages.length > 0 ? (
            <>
              <div className="cp-spacer" />

              {Object.entries(grouped).map(([label, msgs]) => (
                <div key={label} className="cp-date-group">
                  <div className="cp-date-label">{label}</div>

                  {msgs.map((msg, idx) => {
                    const mine = isMine(msg);
                    const senderId = getId(msg.sender);
                    const prevSame = idx > 0 && getId(msgs[idx - 1].sender) === senderId;
                    const nextSame = idx < msgs.length - 1 && getId(msgs[idx + 1].sender) === senderId;
                    const showAvatar = !mine && !nextSame;

                    return (
                      <div key={msg._id} className={`cp-row ${mine ? "sent" : "received"}`}>
                        {!mine && (
                          <div className={`cp-mini-avatar ${showAvatar ? "" : "hidden"}`}>
                            {otherUser?.name?.[0]?.toUpperCase() || "?"}
                          </div>
                        )}
                        <div className={`cp-bubble ${mine ? "sent" : "received"}`}>
                          <p style={{ margin: 0 }}>{msg.content}</p>
                          <span className="cp-time">{fmtTime(msg.createdAt)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="cp-empty">
              <div className="cp-empty-icon">💬</div>
              <p className="cp-empty-text">No messages yet — say hello!</p>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="cp-input-bar">
          <form onSubmit={handleSend} style={{ display: "contents" }}>
            <div className="cp-input-inner">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="cp-input"
                placeholder="Message..."
                autoComplete="off"
              />
              <button type="submit" className="cp-send-btn" disabled={!newMessage.trim()}>
                <FaPaperPlane size={14} />
              </button>
            </div>
          </form>
        </div>

      </div>
    </>
  );
};

export default ConversationPage;