import React from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import winningAnimation from '../../assets/Trophy.json'; // adjust path
import "./WinningAmount.css";

const WinningAmount = ({ amount, onAnimationEnd }) => {
    return (
        <motion.div
            className="winning-amount-container"
            initial={{ y: 100, opacity: 0 }}
            animate={{
                y: [0, -20, 0],
                opacity: 1,
            }}
            transition={{
                y: { duration: 5, ease: 'easeOut' },
                opacity: { duration: 0.1 },
            }}
            onAnimationComplete={onAnimationEnd}
        >
            <div className="winning-amount">
                <Lottie 
                    animationData={winningAnimation} 
                    loop={false} // plays only once
                    style={{ width: 250, height: 250, marginTop: '-30px' }}
                />
                <div className='winning-price border-3'>
                    <h1 style={{fontSize: '40px', marginTop: '-40px'}}>₹{amount}</h1>
                </div>
            </div>
        </motion.div>
    );
};

export default WinningAmount;
