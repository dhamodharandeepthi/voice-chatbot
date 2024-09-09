import React, { useState, useEffect } from 'react';
import './App.css'; 

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechSynthesis = window.speechSynthesis;

const fillers = ["Carry on.", "Nice.", "Yes.", "Got it.", "I see.", "Okay."];

const App = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [avatarResponse, setAvatarResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
      handleResponse(transcript);
    };
    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  const handleResponse = (userInput) => {

    const filler = fillers[Math.floor(Math.random() * fillers.length)];

    const reply = `${filler} You said: ${userInput}. How can I help you further?`;
    setResponse(reply);
    setAvatarResponse(reply);
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(reply);
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    SpeechSynthesis.speak(utterance);
  };

  return (
    <div className="App">
      <h1>Voice Chatbot</h1>
      <div className="avatar">
        <img
          src="/avatar.png" 
          alt="Avatar"
          className={isSpeaking ? 'avatar-speaking' : 'avatar'}
        />
        <div className="response">
          {avatarResponse}
        </div>
      </div>
      <button onClick={() => setIsListening(!isListening)}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      <div className="transcript">
        <p>Transcript: {transcript}</p>
      </div>
    </div>
  );
};

export default App;
