import React from 'react';
import ParticleBackground from './ParticleBackground';
import ChatInterface from './ChatInterface';

function Chat() {
  return (
    <section id="chat" className="chat">
      <ParticleBackground containerId="chat" />
      <div className="container">
        <h2 className="section-title">Ask Me Anything</h2>
        <ChatInterface />
      </div>
    </section>
  );
}

export default Chat;