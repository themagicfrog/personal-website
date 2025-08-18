'use client';

import { useState, useEffect } from 'react';
import './opening.css';

interface OpeningProps {
  onComplete: () => void;
}

export default function Opening({ onComplete }: OpeningProps) {
  const [isVisible] = useState(true);
  const [text, setText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [showBoatText, setShowBoatText] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [buttonProgress, setButtonProgress] = useState(0);
  
  const welcomeText = "welcome traveler!";
  const typingSpeed = 100;
  const pauseBeforeBoat = 1000;
  const lineDelay = 800;
  const buttonFillDuration = 25000; 

  useEffect(() => {
    if (currentIndex < welcomeText.length) {
      const timer = setTimeout(() => {
        setText(welcomeText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else {
      const boatTimer = setTimeout(() => {
        setShowBoatText(true);
        setShowCursor(false);
        
        const lineTimer = setTimeout(() => {
          setVisibleLines(1);
        }, 500);
        return () => clearTimeout(lineTimer);
      }, pauseBeforeBoat);
      return () => clearTimeout(boatTimer);
    }
  }, [currentIndex, welcomeText, pauseBeforeBoat]);

  useEffect(() => {
    if (!showBoatText) {
      const cursorTimer = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      return () => clearInterval(cursorTimer);
    }
  }, [showBoatText]);

  useEffect(() => {
    if (showBoatText && visibleLines < 6) { 
      const timer = setTimeout(() => {
        setVisibleLines(prev => prev + 1);
      }, lineDelay);
      return () => clearTimeout(timer);
    }
  }, [showBoatText, visibleLines, lineDelay]);

  useEffect(() => {
    if (visibleLines >= 6) {
      const interval = setInterval(() => {
        setButtonProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onComplete();
            }, 0);
            return 100;
          }
          return prev + (100 / (buttonFillDuration / 50)); 
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [visibleLines, buttonFillDuration, onComplete]);

  return (
    <div className={`welcomeScreen ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="welcomeContent">
        <h1 className="welcomeText">
          {text}
          {!showBoatText && <span className={`cursor ${showCursor ? 'cursorVisible' : ''}`}>|</span>}
        </h1>
        
        {showBoatText && (
          <div className="boatText">
            {visibleLines >= 1 && <p className="fadeInLine">do you see that island off in the distance?</p>}
            {visibleLines >= 2 && <p className="fadeInLine">it&apos;s a legend among locals.</p>}
            {visibleLines >= 3 && <p className="fadeInLine">they say it&apos;s full of treasures big and small.</p>}
            {visibleLines >= 4 && <p className="fadeInLine">...</p>}
            {visibleLines >= 5 && <p className="fadeInLine">and hey, today, YOU have a chance to explore it!</p>}
            {visibleLines >= 6 && (
              <>
                <p className="fadeInLine">i&apos;ve got this boat right here, with space for you and me.</p>
                <div className="boatButtonContainer fadeInLine">
                  <button 
                    className="boatButton"
                    onClick={() => onComplete()}
                  >
                    hop on boat!
                  </button>
                  <div 
                    className="buttonProgress"
                    style={{ width: `${buttonProgress}%` }}
                  ></div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
