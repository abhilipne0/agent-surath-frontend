import React, { useEffect, useRef, useState } from 'react'
import './DragonTiger.css'
import Table from '../../assets/dragon-tiger-table.webp'
import DragonTigerTableGirl from '../../assets/dragon-tiger-girl.webp'
import SurathLogo from '../../assets/surath_logo.png';
import { io } from 'socket.io-client';
import { clearBetAmounts, fetchDTOpenBets, fetchGameHistory, setEndTime, submitBet } from '../../store/game/dragon-tiger/dragonTiger';
import { useDispatch, useSelector } from 'react-redux';
import PlayingCard from '../andar-bahar/components/PlayingCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import PlaceBet from '../../components/PlaceBet';
import { getUserBalance } from '../../store/user/userSlice';
import WinningAmount from '../../components/winning amount/WinningAmount';
import FullScreenFireworks from './FullScreenFireworks';
import clapsound from './../../assets/clap-sound.mp3';

const socket = io(import.meta.env.VITE_SOCKET_API_URL,{
  transports: ["polling", "websocket"],
});

function DragonTiger() {
  // const timer = 60
  // const formattedTimer = `00:${String(timer ?? 0).padStart(2, '0')}`.split('');
  const userId = localStorage.getItem('userID')
  const [timer, SetTimer] = useState(null)
  const [cards, setCards] = useState({ dragon: null, tiger: null });
  const [visible, setVisible] = useState({ dragon: false, tiger: false });
  const [showResultCard, setShowResultCard] = useState(false);
  const [resultTarget, setResultTarget] = useState(null);
  const [betCard, setBetCard] = useState(null)
  const [betModal, setBetModal] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [winningAmount, setWinningAmount] = useState(null);
  const [showCrackers, setShowCrackers] = useState(false);
  const [blockBets, setBlockBets] = useState(false);
  const [winnerSide, setWinnerSide] = useState(null);
  const [pageLoading, SetPageLoading] = useState(true)
  
  const { endTime, loading, betAmounts, lastRoundResults } = useSelector((state) => state.dragonTigerGame);

  const dispatch = useDispatch()
  const audioRef = useRef(null);

   const requestCurrentSession = () => {
    socket.emit("dragonTiger:joinSession", { userId });
  };

  const triggerResult = (target) => {
    setResultTarget(target);
    setShowResultCard(true);
    setTimeout(() => setShowResultCard(false), 500);
  };

  const getCardAnimation = () => {
    if (resultTarget === 'dragon') return { x: -63, y: 85, opacity: 1 };
    if (resultTarget === 'tiger') return { x: 72, y: 85, opacity: 1 };
    return { x: 0, y: 0, opacity: 1 };
  };

  const placeBet = (cardId) => {
    setBetCard(cardId)
    toggleModal();
  };

  const toggleModal = () => setBetModal(!betModal);

  const handleBetSubmission = async (amount) => {
      await dispatch(submitBet({ amount, side: betCard }));
      dispatch(fetchDTOpenBets());
      toggleModal();
    };

  useEffect(() =>{
    dispatch(getUserBalance());
    dispatch(fetchGameHistory());
    requestCurrentSession();

    socket.on("dragonTiger:currentSession", (data) => {
      const newEndTime = new Date(data.endTime).getTime();
      dispatch(setEndTime(newEndTime));
      dispatch(fetchDTOpenBets());
      SetPageLoading(false)
    });

    socket.on("dragonTiger:sessionStarted", (data) => {
      dispatch(clearBetAmounts())
      setShowCrackers(false)
      setVisible({ dragon: false, tiger: false })
      const newEndTime = new Date(data.endTime).getTime();
      dispatch(setEndTime(newEndTime));
      setBlockBets(false)
    });
    socket.on("dragonTiger:sessionEnded", (data) => {
      setBlockBets(true);

      // Set cards
      setCards({
        dragon: data.dragonCard,
        tiger: data.tigerCard,
      });
    
      // Animate and show cards
      triggerResult('dragon');
      setTimeout(() => {
        setVisible(prev => ({ ...prev, dragon: true }));
      }, 600);
    
      setTimeout(() => {
        triggerResult('tiger');
      }, 1400);
    
      setTimeout(() => {
        setVisible(prev => ({ ...prev, tiger: true }));
      }, 2000);

      setTimeout(() => {
        setWinnerSide(data.winner);
      }, 3000);

      setTimeout(() => {
        setWinnerSide(null);
      }, 8000);
    
      setTimeout(() => {
        if (data.userResult?.isWinner) {
          dispatch(getUserBalance());
          setShowCrackers(true);
          setWinningAmount(data.userResult.amountWon);
          if (audioRef.current) {
            audioRef.current.play().catch(console.error);
          }
        }
        dispatch(fetchGameHistory());
      }, 6000);
    });

    // ⏱️ Visibility change logic to re-sync
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestCurrentSession(); // Re-fetch current session info
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

   
    return () => {
      socket.off("dragonTiger:currentSession");
      socket.off("dragonTiger:sessionStarted");
      socket.off("dragonTiger:sessionEnded");
      // socket.off("andarBahar:yourResult");
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [])

  useEffect(() => {
      const calculateRemainingTime = () => {
        const now = Date.now();
        let remainingTime = Math.max(0, Math.floor((endTime - now) / 1000));
        // Handle NaN or invalid value
        if (isNaN(remainingTime) || remainingTime < 0) {
          remainingTime = 0;
        }

        SetTimer(remainingTime);
      };
      calculateRemainingTime();
      const intervalId = setInterval(calculateRemainingTime, 1000);
  
      return () => clearInterval(intervalId);
  
  }, [endTime]);

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
    {showCrackers && (
          <div>
              {/* <ReactConfetti
                  width={windowDimensions.width}
                  height={windowDimensions.height}
              /> */}
              <FullScreenFireworks
                show={showCrackers}
                onDone={() => setShowCrackers(false)}
              />
          </div>
      )}

      {showCrackers && (
          <div className="winning-amount-wrapper">
              <WinningAmount
                  amount={winningAmount}
                  onAnimationEnd={() => setWinningAmount(null)} // Hide after animation ends
              />
          </div>
          
      )}

    <audio ref={audioRef} src={clapsound} preload="auto" />

    <div className='dragon-tiger full-page-content'>
        <div className='dragon-tiger-page' style={{ position: 'relative' }}>
        <div className='text-center'>
          <div className="timer-box d-flex" style={{marginLeft: '10px', marginBottom: '-35px', paddingTop: '10px'}}>
            {formattedTimer.map((char, index) => (
              <div
                key={index}
                className={char === ':' ? 'timer-separator' : 'timer-digit'}
              >
                {char}
              </div>
            ))}
          </div>
          <img src={DragonTigerTableGirl} alt="table girl" height={100} />
        </div>

        {/* Table Image */}
        <img src={Table} alt="Andar Bahar Table" width="100%" height={230} />

        {/* <div className='dragon-tiger-cat d-flex justify-content-center align-items-center'>
          <img src={SurathLogo} height={40} alt="logo" />
        </div> */}
        <div className='card-group-dt'>
          <div className='dragon-tiget-top-card'>
            <img src={SurathLogo} height={40} alt="logo" />
          </div>

          <div className='d-flex' style={{ gap: '90px' }}>
            {/* Dragon */}
            <div className='d-flex flex-column justify-content-center align-items-center'>
              <div className={`dragon-tiger-card ${winnerSide === 'Dragon' ? 'rainbow-winner' : ''}`}>
                {visible.dragon && cards.dragon ? (
                  <PlayingCard
                    value={cards.dragon.value}
                    suit={cards.dragon.suit}
                    side='Dragon'
                  />
                ) : (
                  <h6 className='mb-0 text-white mt-1' style={{ fontSize: '12px' }}>Dragon</h6>
                )}
              </div>
              <h6 className='mb-0 text-white mt-1' style={{ fontSize: '14px' }}>Dragon</h6>
            </div>
              
            {/* Tiger */}
            <div className='d-flex flex-column justify-content-center align-items-center'>
              <div className={`dragon-tiger-card ${winnerSide === 'Tiger' ? 'rainbow-winner' : ''}`}>
                {visible.tiger && cards.tiger ? (
                  <PlayingCard
                    value={cards.tiger.value}
                    suit={cards.tiger.suit}
                    side='Tiger'
                  />
                ) : (
                  <h6 className='mb-0 text-white mt-1' style={{ fontSize: '12px' }}>Tiger</h6>
                )}
              </div>
              <h6 className='mb-0 text-white mt-1' style={{ fontSize: '14px' }}>Tiger</h6>
            </div>
          </div>
          {/* Animated Result Card */}
          <AnimatePresence>
            {showResultCard && (
              <motion.div
                className="result-card-dt"
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={getCardAnimation()}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {/* {resultTarget?.toUpperCase()} */}
                <img src={SurathLogo} height={40} alt="logo" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
       </div>
       
      <div className='d-flex justify-content-center mt-3 mb-1'  style={{ margin: '0px 10px', gap: '18px', flexWrap: 'wrap' }}>
        <div className='text-center'>
          <h6 style={{height: '20px', fontWeight: 600, color: '#fff'}}>{betAmounts.dragon ? `${betAmounts.dragon}` : ''}</h6>
          <div
            className="btn andar-bahar-btn position-relative bg-primary d-flex justify-content-center align-items-center"
            // style={{ backgroundColor: '#0DCAF0' }}
            onClick={() => !blockBets && placeBet('dragon')}
          >
            Dragon
             {
                blockBets && (
                  <div className="lock-overlay" style={{borderRadius: '5px'}}>
                    <i className="bi bi-lock-fill lock-icon"></i>
                  </div>
                )
              }
          </div>
          <p className='text-light'>1.9<span style={{fontSize: '12px'}}>X</span></p>
        </div>
        <div className='text-center'>
          <h6 style={{height: '20px', fontWeight: 600, color: '#fff'}}>{betAmounts.tie ? `${betAmounts.tie}` : ''}</h6>
          <div
            className="btn andar-bahar-btn position-relative d-flex justify-content-center align-items-center"
            style={{ backgroundColor: '#cd1a1af4' }}
            onClick={() => !blockBets && placeBet('tie')}
          >
            Tie
             {
                blockBets && (
                  <div className="lock-overlay" style={{borderRadius: '5px'}}>
                    <i className="bi bi-lock-fill lock-icon"></i>
                  </div>
                )
              }
          </div>
          <p className='text-light'>5.0<span style={{fontSize: '12px'}}>X</span></p>
        </div>
        <div className='text-center'>
          <h6 style={{height: '20px', fontWeight: 600, color: '#fff'}}>{betAmounts.tiger ? `${betAmounts.tiger}` : ''}</h6>
          <div
            className="btn andar-bahar-btn position-relative d-flex justify-content-center align-items-center"
            style={{ backgroundColor: '#FFC107' }}
            onClick={() => !blockBets && placeBet('tiger')}
          >
            Tiger
             {
                blockBets && (
                  <div className="lock-overlay" style={{borderRadius: '5px'}}>
                    <i className="bi bi-lock-fill lock-icon"></i>
                  </div>
                )
              }
          </div>
          <p className='text-light'>1.9<span style={{fontSize: '12px'}}>X</span></p>
        </div>
      </div>

      {/* History */}

      <div className='mb-2'>
        <div className='text-light mx-2' style={{borderBottom: '2px solid white'}}>
          <h6>History</h6>
        </div>

       <div className="d-flex justify-content-end me-2 mt-2 flex gap-2">
        {lastRoundResults &&
          lastRoundResults.filter(
            (r) => r.winner === 'Dragon' || r.winner === 'Tiger' || r.winner === 'Tie'
          ).length > 0 &&
          lastRoundResults
            .filter(
              (r) => r.winner === 'Dragon' || r.winner === 'Tiger' || r.winner === 'Tie'
            )
            .slice(0, 8)
            .map((result, index) => {
              let symbol = null;
              let bgClass = null;
            
              if (result.winner === 'Dragon') {
                symbol = 'D';
                bgClass = 'bg-primary';
              } else if (result.winner === 'Tiger') {
                symbol = 'T';
                bgClass = 'bg-warning';
              } else if (result.winner === 'Tie') {
                symbol = 'T';
                bgClass = 'bg-danger';
              }
            
              return (
                <div
                  key={index}
                  className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold ${bgClass}`}
                  style={{ width: '30px', height: '30px' }}
                >
                  <h6 className="mb-0">{symbol}</h6>
                </div>
              );
            })}
      </div>

      </div>
      

      <Modal isOpen={betModal} toggle={toggleModal} className='my-0'>
        <ModalHeader className='text-white py-2 justify-content-between' style={{ backgroundColor: '#08c' }} toggle={toggleModal}  close={
          <i style={{ cursor: "pointer" }} onClick={toggleModal} className="bi bi-x-lg float-end"></i>}>
            Place Bet
        </ModalHeader>
        <ModalBody className='text-white py-4 bg-blue'>
          <PlaceBet onSubmit={handleBetSubmission} loading={loading}/>
        </ModalBody>
      </Modal>
    </div>
    </>
  )
}

export default DragonTiger