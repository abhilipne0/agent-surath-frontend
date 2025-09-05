import React, { useEffect, useState } from 'react';

function PlayingCard({ value, suit, delay = 0 }) {
  const [show, setShow] = useState(delay === 0);

  const suitSymbols = {
    Hearts: '♥',
    Diamonds: '♦',
    Clubs: '♣',
    Spades: '♠',
  };

  const symbol = suitSymbols[suit] || '?';
  const isRed = suit === 'Hearts' || suit === 'Diamonds';

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(timer);
    } else {
      setShow(true);
    }
  }, [delay]);

  if (!show) return null;

  return (
    <div className={`playing-card ${isRed ? 'red' : 'black'}`}>
      <div className="corner top-left">{symbol}</div>
      <div className="center">{value}</div>
      <div className="corner bottom-right">{symbol}</div>
    </div>
  );
}

export default PlayingCard;
