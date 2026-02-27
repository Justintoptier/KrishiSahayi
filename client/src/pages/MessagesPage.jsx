"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConversations } from "../redux/slices/messageSlice";
import MessageItem from "../components/MessageItem";
import Loader from "../components/Loader";
import { FaComments, FaLeaf } from "react-icons/fa";

const MessagesPage = () => {
  const dispatch = useDispatch();
  const { conversations, loading } = useSelector((state) => state.messages);

  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

        .mp-root {
          font-family: 'Jost', sans-serif;
          min-height: 100vh;
          background: #f9f5ef;
        }

        .mp-hero {
          background: linear-gradient(135deg, #1e2a1f 0%, #2d3a2e 60%, #1a2e20 100%);
          padding: 110px 2rem 48px;
          position: relative;
          overflow: hidden;
        }

        .mp-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(ellipse at 80% 40%, rgba(74, 124, 89, 0.2) 0%, transparent 60%);
        }

        .mp-hero-inner {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
        }

        .mp-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(74, 124, 89, 0.2);
          border: 1px solid rgba(74, 124, 89, 0.3);
          color: #7db894;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 100px;
          margin-bottom: 16px;
        }

        .mp-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4vw, 2.8rem);
          font-weight: 700;
          color: #e8d5b0;
          line-height: 1.15;
          margin-bottom: 10px;
        }

        .mp-title em { font-style: italic; color: #7db894; }

        .mp-subtitle {
          color: #8a7a65;
          font-size: 0.95rem;
          font-weight: 300;
        }

        .mp-main {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 2rem 80px;
        }

        .mp-count {
          font-size: 0.8rem;
          color: #8a7a65;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 500;
          margin-bottom: 20px;
        }

        .mp-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mp-empty {
          text-align: center;
          padding: 80px 20px;
          background: #fefcf8;
          border-radius: 20px;
          border: 1px solid rgba(101, 78, 51, 0.1);
        }

        .mp-empty-icon {
          width: 80px;
          height: 80px;
          background: #f0e8d8;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #8a7a65;
          font-size: 28px;
        }

        .mp-empty-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 600;
          color: #3d2f1e;
          margin-bottom: 8px;
        }

        .mp-empty-sub {
          color: #8a7a65;
          font-size: 0.9rem;
          font-weight: 300;
          max-width: 360px;
          margin: 0 auto;
          line-height: 1.6;
        }
      `}</style>

      <div className="mp-root">
        <div className="mp-hero">
          <div className="mp-hero-inner">
            <div className="mp-eyebrow">
              <FaComments size={10} /> Inbox
            </div>
            <h1 className="mp-title">My <em>Messages</em></h1>
            <p className="mp-subtitle">Stay connected with farmers and customers.</p>
          </div>
        </div>

        <div className="mp-main">
          {conversations.length > 0 ? (
            <>
              <p className="mp-count">{conversations.length} conversation{conversations.length !== 1 ? "s" : ""}</p>
              <div className="mp-list">
                {conversations.map((conversation) => (
                  <MessageItem key={conversation.user._id} conversation={conversation} />
                ))}
              </div>
            </>
          ) : (
            <div className="mp-empty">
              <div className="mp-empty-icon"><FaComments /></div>
              <h3 className="mp-empty-title">No Messages Yet</h3>
              <p className="mp-empty-sub">
                Start a conversation by messaging a farmer or responding to customer inquiries.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessagesPage;