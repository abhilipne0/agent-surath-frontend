import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AndarBahar.css';
import AndarBaharTable from '../../assets/andar-bahar-table-a.webp';
import AndarBaharTableGirl from '../../assets/andar-bahar-table-girl.webp';
import SurathLogo from '../../assets/surath_logo.png';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import PlaceBet from '../../components/PlaceBet';
import WinningAmount from '../../components/winning amount/WinningAmount';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearBetAmounts,
  fetchABOpenBets,
  fetchGameHistory,
  setEndTime,
  submitBet,
} from '../../store/game/andar-bahar/andarBaharSlice';
import { getUserBalance } from '../../store/user/userSlice';
import PlayingCard from './components/PlayingCard';
import clapsound from './../../assets/clap-sound.mp3';
import FullScreenFireworks from '../dragon-tiger/FullScreenFireworks';

export default function AndarBaharGame() {
  const dispatch = useDispatch();
  const { betAmounts, endTime, lastRoundResults, loading } = useSelector(
    (state) => state.andarBaharGame
  );

  // UI States
  const [isBetModalOpen, setBetModalOpen] = useState(false);
  const [betSide, setBetSide] = useState(null);
  const [mainCard, setMainCard] = useState(null);
  const [abCards, setAbCards] = useState([]);
  const [winnerSide, setWinnerSide] = useState(null);
  const [showResultCard, setShowResultCard] = useState(false);
  const [resultTarget, setResultTarget] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [winningAmount, setWinningAmount] = useState(null);
  const [blockBets, setBlockBets] = useState(false);
  const [timer, setTimer] = useState(0);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [pageLoading, SetPageLoading] = useState(true)

  // Refs
  const socketRef = useRef(null);
  const audioRef = useRef(null);

  const userId = localStorage.getItem('userID');

  // Helper: Trigger logo animation
  const triggerResult = (target) => {
    setResultTarget(target);
    setShowResultCard(true);
    setTimeout(() => setShowResultCard(false), 500);
  };

  // Helper: Result card animation positions
  const getCardAnimation = () => {
    if (resultTarget === 'andar') return { x: -88, y: 77, opacity: 1 };
    if (resultTarget === 'bahar') return { x: 82, y: 77, opacity: 1 };
    if (resultTarget === 'tie') return { x: -4, y: 77, opacity: 1 };
    return { x: 0, y: 0, opacity: 1 };
  };

  // Place bet flow
  const toggleBetModal = () => setBetModalOpen((prev) => !prev);
  const placeBet = (side) => {
    setBetSide(side);
    toggleBetModal();
  };
  const handleBetSubmission = async (amount) => {
    await dispatch(submitBet({ amount, side: betSide }));
    setBetSide(null);
    toggleBetModal();
  };

  const delays = (ms) => new Promise((res) => setTimeout(res, ms));

  const revealCardsWithAnimation = async (cards, winnerSide) => {
    setAbCards([]);
    setResultTarget(null);
    setWinnerSide(null);
    setBlockBets(true);
    for (let i = 0; i < cards.length; i++) {
      const item = cards[i];
      const sideLower = item.side.toLowerCase();

      triggerResult(sideLower);
      await delays(800); // Wait for logo animation

      setAbCards((prev) => [...prev, { ...item, side: sideLower }].slice(-2));
      await delays(500); // Small pause before next card
    }

    // Show final winner side highlight
    setWinnerSide(winnerSide);

    // Wait a bit and then reset the table
    await delays(4000);
    resetTable();
  };


  // Socket: Request current session
  const requestCurrentSession = () => {
    socketRef.current.emit('joinSession', { userId });
  };

  // Initial setup
  useEffect(() => {
    dispatch(fetchABOpenBets());
    dispatch(getUserBalance());
    dispatch(fetchGameHistory());

    // Setup socket
    if (!socketRef.current) {
      const socket = io(import.meta.env.VITE_SOCKET_API_URL, {
        transports: ['websocket'],
      });
      socketRef.current = socket;

      socket.on('connect', () => {
        requestCurrentSession();
      });

      // --- Current Session ---
      socket.on('currentSession', async (data) => {
        const { endTime, matchCard, otherCards, side } = data;
        SetPageLoading(false);
        const baseSessionEndTime = new Date(endTime).getTime();
        dispatch(setEndTime(baseSessionEndTime));
        const now = Date.now();
        const cardDelay = 1190; // ms per card
        const totalAnimationDuration = (otherCards?.length || 0) * cardDelay;
        const animationEndTime = baseSessionEndTime + totalAnimationDuration;

        setMainCard(matchCard);

        if (now < baseSessionEndTime) {
          // Session still live — no cards revealed
          setAbCards([]);
          setWinnerSide(null);
          triggerResult('tie');
          setBlockBets(false);
        } else if (now >= animationEndTime) {
          // Animation complete — reveal all cards sequentially with animation
          await revealCardsWithAnimation(otherCards, side);
        } else {
          // Animation in progress — show cards that should already be revealed
          const elapsedAfterSessionEnd = now - baseSessionEndTime;
          const cardsRevealedCount = Math.floor(elapsedAfterSessionEnd / cardDelay);

          setAbCards(otherCards.slice(0, cardsRevealedCount));
          triggerResult('tie');
          setBlockBets(true);

          // Animate remaining cards
          await revealCardsWithAnimation(otherCards.slice(cardsRevealedCount), side);
        }
      });


      // --- Session Started ---
      socket.on('andarBahar:sessionStarted', (data) => {
        dispatch(setEndTime(new Date(data.endTime).getTime()));
        setMainCard(data.matchCard);
        setAbCards([]);
        triggerResult('tie');
        setBlockBets(false);
      });

      // --- Session Ended ---
      socket.on('andarBahar:sessionEnded', async (data) => {
        setBlockBets(true);
        if (Array.isArray(data.otherCards)) {
          await revealCardsWithAnimation(data.otherCards, data.side);
          dispatch(fetchGameHistory());
        }
      });


      // --- Your Result ---
      socket.on('andarBahar:yourResult', (data) => {
        if (data.isWinner) {
          setShowConfetti(true);
          setWinningAmount(data.amountWon);
          if (audioRef.current) {
            audioRef.current.play().catch(console.error);
          }
          dispatch(getUserBalance());
          setTimeout(() => setShowConfetti(false), 5000);
        }
      });
    }

    // Re-sync on tab focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // requestCurrentSession();
        window.location.reload()
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    const calculateRemainingTime = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimer(remaining);
    };
    calculateRemainingTime();
    const id = setInterval(calculateRemainingTime, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  // Helpers
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const resetTable = () => {
    setWinnerSide(null);
    setMainCard(null);
    setAbCards([]);
    dispatch(clearBetAmounts());
  };

  const formattedTimer = `00:${String(timer ?? 0).padStart(2, '0')}`.split('');

  return (
    <>
      {pageLoading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'auto'
          }}
        >
          <div className="spinner-border text-light" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {showConfetti && (
        <FullScreenFireworks
          show={showConfetti}
          onDone={() => setShowConfetti(false)}
        />
      )}

      {winningAmount && (
        <div className="winning-amount-wrapper">
          <WinningAmount amount={winningAmount} onAnimationEnd={() => setWinningAmount(null)} />
        </div>
      )}

      <audio ref={audioRef} src={clapsound} preload="auto" />

      <div className="andar-bahar-page full-page-content" style={{ position: 'relative' }}>
        {/* Timer */}
        <div className="text-center">
          <div className="timer-box d-flex" style={{ marginLeft: 10, marginBottom: -40, paddingTop: 10 }}>
            {formattedTimer.map((char, index) => (
              <div key={index} className={char === ':' ? 'timer-separator' : 'timer-digit'}>
                {char}
              </div>
            ))}
          </div>
          <img src={AndarBaharTableGirl} alt="Dealer" height={100} />
        </div>

        {/* Table */}
        <img src={AndarBaharTable} alt="Table" width="100%" height={220} />
        <div className="andar-bahar-cat d-flex justify-content-center align-items-center">
          <img src={SurathLogo} height={40} alt="Logo" />
        </div>

        {/* Cards */}
        <div className="card-group-ab">
          <div className={`andar-bahar-card ${winnerSide === 'Andar' ? 'rainbow-winner' : ''}`}>
            {abCards.find((c) => c.side === 'andar') ? (
              <PlayingCard {...abCards.find((c) => c.side === 'andar')} side="Andar" />
            ) : (
              <h6>Andar</h6>
            )}
          </div>
          <div className="andar-bahar-card">
            {mainCard && <PlayingCard value={mainCard.value} suit={mainCard.suit} side="tie" delay={1000} />}
          </div>
          <div className={`andar-bahar-card ${winnerSide === 'Bahar' ? 'rainbow-winner' : ''}`}>
            {abCards.find((c) => c.side === 'bahar') ? (
              <PlayingCard {...abCards.find((c) => c.side === 'bahar')} side="Bahar" />
            ) : (
              <h6>Bahar</h6>
            )}
          </div>
        </div>

        {/* Bet Buttons */}
        <div className="d-flex justify-content-between mt-3 mb-1" style={{ margin: '0px 30px' }}>
          {[
            { label: 'Andar', color: '#0d6efd', side: 'andar' },
            { label: 'Tie', color: '#cd1a1af4', side: 'tie' },
            { label: 'Bahar', color: '#FFC107', side: 'bahar' },
          ].map(({ label, color, side }) => (
            <div key={label} className="text-center">
              <h6 style={{ height: 20, fontWeight: 600, color: '#fff' }}>
                {betAmounts[side] || ''}
              </h6>
              <div
                className="btn andar-bahar-btn position-relative d-flex justify-content-center align-items-center"
                style={{ backgroundColor: color }}
                onClick={() => !blockBets && placeBet(side)}
              >
                {label}
                {blockBets && (
                  <div className="lock-overlay" style={{ borderRadius: 5 }}>
                    <i className="bi bi-lock-fill lock-icon"></i>
                  </div>
                )}
              </div>
              <p className="text-light">
                1.9<span style={{ fontSize: 12 }}>X</span>
              </p>
            </div>
          ))}
        </div>

        {/* Result Animation */}
        <AnimatePresence>
          {showResultCard && (
            <motion.div
              className="result-card"
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={getCardAnimation()}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <img src={SurathLogo} height={40} alt="logo" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        <div className="mb-2">
          <div className="text-light mx-2" style={{ borderBottom: '2px solid white' }}>
            <h6>History</h6>
          </div>
          <div className="d-flex justify-content-end me-2 mt-2 flex gap-2">
            {lastRoundResults &&
              lastRoundResults
                .filter((r) => ['Andar', 'Bahar', 'Tie'].includes(r.winner))
                .slice(0, 8)
                .map((result, index) => {
                  let symbol = result.winner[0];
                  let bgClass =
                    result.winner === 'Andar'
                      ? 'bg-primary'
                      : result.winner === 'Bahar'
                        ? 'bg-warning'
                        : 'bg-danger';
                  return (
                    <div
                      key={index}
                      className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold ${bgClass}`}
                      style={{ width: 30, height: 30 }}
                    >
                      <h6 className="mb-0">{symbol}</h6>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>

      {/* Bet Modal */}
      <Modal isOpen={isBetModalOpen} toggle={toggleBetModal} className="my-0">
        <ModalHeader
          className="text-white py-2 justify-content-between"
          style={{ backgroundColor: '#08c' }}
          toggle={toggleBetModal}
          close={
            <i
              style={{ cursor: 'pointer' }}
              onClick={toggleBetModal}
              className="bi bi-x-lg float-end"
            ></i>
          }
        >
          Place Bet
        </ModalHeader>
        <ModalBody className="text-white py-4 bg-blue">
          <PlaceBet onSubmit={handleBetSubmission} loading={loading} />
        </ModalBody>
      </Modal>
    </>
  );
}
