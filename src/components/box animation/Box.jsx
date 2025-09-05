import React, { useEffect, useState } from 'react';
import './Box.css';
import umbrella from './../../assets/umbrella.svg';
import football from './../../assets/football.svg';
import sun from './../../assets/sun.svg';
import oilLamp from './../../assets/oil-lamp.svg';
import cow from './../../assets/cow.svg';
import bucket from './../../assets/bucket.svg';
import kite from './../../assets/kite.svg';
import spinner from './../../assets/spinner.svg';
import rose from './../../assets/rose.svg';
import butterfly from './../../assets/butterfly.svg';
import hope from './../../assets/hope.svg';
import rabbit from './../../assets/rabbit.svg';

const BoxAnimation = ({ showBoxAnimation, lastResult }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [closeAnimation, setCloseAnimation] = useState('');
  const imageMap = {
    UMBRELLA: umbrella,
    FOOTBALL: football,
    SUN: sun,
    OIL_LAMP: oilLamp,
    COW: cow,
    BUCKET: bucket,
    KITE: kite,
    SPINNER: spinner,
    ROSE: rose,
    BUTTERFLY: butterfly,
    HOPE: hope,
    RABBIT: rabbit,
  };

  useEffect(() => {
    if (showBoxAnimation && !isAnimating) {
      // Start opening animation
      setIsAnimating(true);
      setIsOpen(true);
      setCloseAnimation('');
    } else if (!showBoxAnimation && isAnimating) {
      // Delay closing animation to allow the current animation to finish
      const closeTimeout = setTimeout(() => {
        setCloseAnimation('close');
        setIsOpen(false);
        setIsAnimating(false);
      }, 2000); // Adjust delay to match your animation duration

      return () => clearTimeout(closeTimeout);
    }
  }, [showBoxAnimation, isAnimating]);

  return (
    <div>
      <div className={`box-body ${isOpen ? 'open' : closeAnimation}`}>
        <img
          className="img p-1"
          style={{ borderRadius: '5px', backgroundColor: '#ffff' }}
          src={imageMap[lastResult?.winningCard] || ''}
          width={60}
          height={60}
          alt={lastResult?.winningCard || 'placeholder'}
        />
        <div className="box-lid">
          <div className="box-bowtie"></div>
        </div>
      </div>
    </div>
  );
};

export default BoxAnimation;
