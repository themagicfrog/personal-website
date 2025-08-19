'use client';

import { useState, useEffect } from 'react';
import './opening.css';

interface OpeningProps {
  onComplete: () => void;
}

export default function Opening({ onComplete }: OpeningProps) {
  const [isVisible] = useState(true);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showSeagullText, setShowSeagullText] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  
  const seagullText = [
    "CAW CAW! hello traveler",
    "see that island over there?",
    "the locals say there are TREASURES there",
    "and today, i'm taking you on this boat to the island",
    "hop on the boat! CAW!"
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSeagullText(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showSeagullText) return;

    if (currentLine < seagullText.length) {
      if (currentChar < seagullText[currentLine].length) {
        const timer = setTimeout(() => {
          setCurrentChar(prev => prev + 1);
        }, 100);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setCurrentLine(prev => prev + 1);
          setCurrentChar(0);
        }, 500);
        return () => clearTimeout(timer);
      }
    } else {
      
      setTypingComplete(true);
    }
  }, [showSeagullText, currentLine, currentChar, seagullText]);

  return (
    <div className={`welcomeScreen ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="sky"></div>
      <div className="ocean">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>
      <div className="island">
        <img src="/island.png" alt="Island on the horizon" />
      </div>
      <div 
        className={`boat ${typingComplete ? 'boatHighlight' : ''}`}
        onClick={() => onComplete()}
        style={{ cursor: typingComplete ? 'pointer' : 'default' }}
      >
        <img src="/boat.png" alt="Boat on the ocean" />
      </div>
      <div className="seagull">
        <img src="/seagull.png" alt="Seagull flying" />
        {showSeagullText && (
          <div className="seagullText">
            {seagullText.map((line, index) => (
              <p key={index} className="seagullLine">
                {index < currentLine 
                  ? line 
                  : index === currentLine 
                    ? line.slice(0, currentChar) 
                    : ''
                }
                {index === currentLine && currentChar < line.length && (
                  <span className="cursor">|</span>
                )}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
