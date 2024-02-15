'use client';
import React from 'react';
import './Chatbot.css';
import generateResponse from '../../code/generateResponse';

const Chatbot = () => {
    // TODO: Implement a more React-like way of handling the form submission
    const progressConversation = async (e) => {
        const question = e.target.elements['user-input'].value;
        const userInput = document.getElementById('user-input')
        const chatbotConversation = document.getElementById('chatbot-conversation-container')
        userInput.value = ''

        // add human message
        const newHumanSpeechBubble = document.createElement('div')
        newHumanSpeechBubble.classList.add('speech', 'speech-human')
        chatbotConversation.appendChild(newHumanSpeechBubble)
        newHumanSpeechBubble.textContent = question
        chatbotConversation.scrollTop = chatbotConversation.scrollHeight

        const response = await generateResponse(question)

        // add AI message
        const newAiSpeechBubble = document.createElement('div')
        newAiSpeechBubble.classList.add('speech', 'speech-ai')
        chatbotConversation.appendChild(newAiSpeechBubble)
        newAiSpeechBubble.textContent = response
        chatbotConversation.scrollTop = chatbotConversation.scrollHeight
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header" onClick={() => testing('hello')}>
                <p className="sub-heading">Assistant Knowledge Bank</p>
            </div>
            <div className="chatbot-conversation-container" id="chatbot-conversation-container">
            </div>
            <form id="form" className="chatbot-input-container" onSubmit={(e) => {
                e.preventDefault();
                progressConversation(e);
            }}>
                <input name="user-input" type="text" id="user-input" placeholder="Type here..." required />
                <button id="submit-btn" className="submit-btn">Send</button>
            </form>
        </div>
    );
};

export default Chatbot;

