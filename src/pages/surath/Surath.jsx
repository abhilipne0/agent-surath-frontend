import React, { useEffect, useRef, useState } from 'react';
import {Modal, ModalBody, ModalHeader } from 'reactstrap';
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
import PlaceBet from '../../components/PlaceBet';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLastResults, fetchOpenBets, fetchSessionInfo, resetBets, submitBet, updateSessionRemainder, setEndTime } from '../../store/game/surath/gameSlice';
import { getUserBalance } from '../../store/user/userSlice';
import BoxAnimation from '../../components/box animation/Box';
import WinningAmount from '../../components/winning amount/WinningAmount';
import Stream from '../surath/stream/Stream';
import FullScreenFireworks from '../dragon-tiger/FullScreenFireworks';


const socket = io(import.meta.env.VITE_SOCKET_API_URL);

function Surath() {
    const dispatch = useDispatch();
    // const navigate = useNavigate()
    const audioRef = useRef(null)

    const userId = localStorage.getItem('userID')

    const { betAmounts, endTime, lastResults, loading } = useSelector((state) => state.game);
    // const { balance, bonusAmount, availableBalance } = useSelector((state) => state.user);
    const [betModal, setBetModal] = useState(false);
    const [currentBetCard, setCurrentBetCard] = useState(null);
    const [showBoxAnimation, setShowBoxAnimation] = useState(false)
    const [latestResult, setLatestResult] = useState()
    const [animatedBox, setAnimatedBox] = useState(null);
    // const [userPhone, setUserPhone] = useState(null)
    const [showCrackers, setShowCrackers] = useState(false);
    const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [winningAmount, setWinningAmount] = useState(null);
    const [showLiveStream, setShowLiveStream] = useState(false)
    const [timer, SetTimer] = useState()

    const cardData = [
        { id: 'UMBRELLA', image: umbrella },
        { id: 'FOOTBALL', image: football },
        { id: 'SUN', image: sun },
        { id: 'OIL_LAMP', image: oilLamp },
        { id: 'COW', image: cow },
        { id: 'BUCKET', image: bucket },
        { id: 'KITE', image: kite },
        { id: 'SPINNER', image: spinner },
        { id: 'ROSE', image: rose },
        { id: 'BUTTERFLY', image: butterfly },
        { id: 'HOPE', image: hope },
        { id: 'RABBIT', image: rabbit },
    ];

    const toggleModal = () => setBetModal(!betModal);

    const placeBet = (cardId) => {
        setCurrentBetCard(cardId);
        toggleModal();
    };

    const handleBetSubmission = async (amount) => {
        await dispatch(submitBet({ amount, card: currentBetCard }));
        toggleModal();
    };

    useEffect(() => {
        // Initial fetch on load
        dispatch(fetchSessionInfo());
        dispatch(fetchOpenBets());
        dispatch(fetchLastResults());
        dispatch(getUserBalance());
      
        const handleSessionStarted = (sessionData) => {
          setShowBoxAnimation(false);
          if (sessionData.own === 'S') {
            setShowLiveStream(true)
          } else {
            setShowLiveStream(false)
          }
          const newEndTime = new Date(sessionData.endTime).getTime();
          dispatch(setEndTime(newEndTime))
          dispatch(resetBets());
        };
      
        const handleSessionEnded = (sessionData) => {
          dispatch(updateSessionRemainder(sessionData.sessionRemainder)); // Update sessionRemainder
          const remainder = sessionData.sessionRemainder;

          const userWinner = sessionData.winners.find((winner) => winner.userId === userId);
      
          if (userWinner) {
            setWinningAmount(userWinner.amountWon); // Show winning amount animation
            setShowCrackers(true); // Show crackers
            if (audioRef.current) {
                audioRef.current.play().catch((err) => {
                  console.error("Error playing sound:", err);
                });
              }
            setTimeout(() => setShowCrackers(false), 5000);
          }
      
          if (remainder >= 1 && remainder <= 50) {
            setAnimatedBox(remainder); // Animate the specific box
            setTimeout(() => setAnimatedBox(null), 3000); // Remove animation after 2 seconds
          }
      
          setLatestResult({ winningCard: sessionData.winningCard });
          setShowBoxAnimation(true);
          dispatch(fetchLastResults());
          dispatch(getUserBalance());
          dispatch({ type: 'SET_LAST_ROUND_RESULT', payload: sessionData });
        };
      
        socket.on("sessionStarted", handleSessionStarted);
        socket.on("sessionEnded", handleSessionEnded);
      
        return () => {
          socket.off("sessionStarted", handleSessionStarted);
          socket.off("sessionEnded", handleSessionEnded);
        };
      }, [dispatch]);

    useEffect(() => {
        const handleReactivation = () => {
          dispatch(fetchSessionInfo());
          dispatch(fetchOpenBets());
          dispatch(fetchLastResults());
          dispatch(getUserBalance());
        };
      
        const handleVisibilityChange = () => {
          if (document.visibilityState === 'visible') {
            handleReactivation();
          }
        };
      
        const handleOnline = () => {
          window.location.reload(); // Refresh page on network reconnect
        };
      
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('online', handleOnline);
      
        return () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          window.removeEventListener('online', handleOnline);
        };
    }, [dispatch]);



      useEffect(() => {
        const calculateRemainingTime = () => {
          const now = Date.now(); // Get the current time in milliseconds
          const remainingTime = Math.max(0, Math.floor((endTime - now) / 1000)); // Calculate time left in seconds
          SetTimer(remainingTime); // Update the state with the new remaining time
        };
    
        // Initial calculation of remaining time
        calculateRemainingTime();
    
        // Update the timer every second
        const intervalId = setInterval(calculateRemainingTime, 1000);
    
        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
      }, [endTime]);
  return (
    <>
        {showCrackers && (
                <div>
                    <FullScreenFireworks
                      show={showCrackers}
                      onDone={() => setShowConfetti(false)}
                    />
                </div>
            )}

            {winningAmount && (
                <div className="winning-amount-wrapper">
                    <WinningAmount
                        amount={winningAmount}
                        onAnimationEnd={() => setWinningAmount(null)} // Hide after animation ends
                    />
                </div>
            )}

            <div className='full-page-content'>

            <Stream animatedBox={animatedBox} showLiveStream={showLiveStream} />

            {/* Main Bet Place Area */}
            <div className='titli-mail-box'>
                <div className="container-fluid">
                    <div className="row px-2 pb-2">
                        <div className="card-container p-0">
                            {cardData.map((card) => (
                                <div className="p-0 d-flex flex-column" key={card.id}>
                                    <span className="bet-amount">
                                        {betAmounts[card.id] ? `₹${betAmounts[card.id]}` : ''}
                                    </span>
                                    <div
                                        className={`card p-2 mt-1 position-relative d-flex justify-content-center align-items-center ${timer <= 5 ? 'locked' : ''}`}
                                        style={{ cursor: timer > 5 ? 'pointer' : 'not-allowed' }}
                                        onClick={() => timer > 5 && placeBet(card.id)}
                                    >
                                        <div className="d-flex justify-content-center align-items-center w-100 h-100">
                                            <img src={card.image} alt={card.id} />
                                        </div>
                                        {timer <= 5 && (
                                            <div className="lock-overlay">
                                                <i className="bi bi-lock-fill lock-icon"></i>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Result */}
            <div>
                <div className="py-1 container-fluid d-flex justify-content-center">
                    <h6 className='mb-0' style={{overflow: 'hidden'}}>Result</h6>
                </div>
                <div className="container-fluid">
                    <div className="card p-4 pb-2 bg-blue text-white my-1 mb-3">
                        <div className="row">
                            <div className="col-4 p-0 text-center">
                                <span>Timer</span>
                                <h1 style={{overflow: 'hidden'}}>{timer ? timer : 0}&nbsp;Sec</h1>
                            </div>
                            <div className="col-4 p-0 px-3 d-flex justify-content-center">
                                {/* <div className="card p-3 bg-warning">
                                    <img src={cardData.find(card => card.id === lastRoundResult?.winningCard)?.image} alt="" className='img-fluid' />
                                </div> */}
                                <BoxAnimation showBoxAnimation={showBoxAnimation} lastResult={latestResult}/>
                            </div>
                            <div className="col-4 p-0 text-center">
                                <span>Timer</span>
                                <h1 style={{overflow: 'hidden'}}>{timer ? timer : 0}&nbsp;Sec</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* History */}

            <div className=''>
                <div style={{ backgroundColor: "#F4EBFF" }}>
                    <div className='container-fluid px-2 d-flex justify-content-center align-content-center py-1'>
                        <h6 className='m-0' style={{overflow: 'hidden'}}>Last 2 Results</h6>
                    </div>
                </div>
                <div className='row pe-2 justify-content-between'>
                    <div className="col-1"></div>
                    <div className="col-10 d-flex justify-content-end my-2">
                        {lastResults?.map((result, index) => {
                            const card = cardData.find(card => card.id === result.result);
                            return (
                                <div 
                                    key={index} 
                                    className="rounded px-1 border d-flex align-items-center justify-content-center me-1 bg-warning"
                                >
                                    {card && (
                                        <img 
                                            src={card.image} 
                                            alt={result.result} 
                                            className="img-fluid m-1" 
                                            style={{ width: '24px', height: '24px'}}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Place Bet Modal */}
            <Modal isOpen={betModal} toggle={toggleModal} className='my-0'>
                <ModalHeader className='text-white py-2 justify-content-between' style={{ backgroundColor: '#08c' }} toggle={toggleModal}  close={
                    <i style={{ cursor: "pointer" }} onClick={toggleModal} className="bi bi-x-lg float-end"></i>
                }>
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

export default Surath