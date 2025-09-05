"use client"

import { useState, useEffect } from "react"
import "./teenpatti.css"
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_API_URL);

const TeenPatti = () => {
    const [timeLeft, setTimeLeft] = useState(30)
    const [gamePhase, setGamePhase] = useState("betting") // "betting" | "revealing" | "result"
    const [selectedBet, setSelectedBet] = useState(null)
    const [betAmount, setBetAmount] = useState(100)
    const [cards, setCards] = useState({ player1: [], player3: [] })
    const [gameHistory, setGameHistory] = useState([
        { id: 1, winner: "player1", player1Bet: 150, player3Bet: 100, tieBet: 50 },
        { id: 2, winner: "tie", player1Bet: 200, player3Bet: 200, tieBet: 300 },
        { id: 3, winner: "player3", player1Bet: 100, player3Bet: 250, tieBet: 75 },
        { id: 4, winner: "player1", player1Bet: 300, player3Bet: 150, tieBet: 100 },
        { id: 5, winner: "player3", player1Bet: 125, player3Bet: 275, tieBet: 50 },
        { id: 6, winner: "player1", player1Bet: 200, player3Bet: 100, tieBet: 150 },
        { id: 7, winner: "tie", player1Bet: 175, player3Bet: 175, tieBet: 400 },
        { id: 8, winner: "player3", player1Bet: 150, player3Bet: 300, tieBet: 75 },
    ])

    const userId = localStorage.getItem('userID')

    useEffect(() => {
        socket.emit("teenPatti:joinSession", { userId: userId });

        socket.on("teenPatti:currentSession", (data) => {
            console.log("currentSession =>", data)
            if (!data.error) {
                // setSession(data);
                // setTimer(Math.floor((data.endTime - Date.now()) / 1000));
            }
        });

        socket.on("teenPatti:sessionStarted", (data) => {
            console.log("sessionStarted =>", data)
            setTimer(Math.floor((endTime - Date.now()) / 1000));
            setWinner(null);
            setPlayerCards([[], []]);
        });

        socket.on("teenPatti:sessionEnded", (data) => {
            console.log("sessionEnded =>", data)
            setWinner(data.winner);
            setPlayerCards(data.playerCards);
            setUserResult(data.userResult);
        });

        return () => {
            socket.off("teenPatti:currentSession");
            socket.off("teenPatti:sessionStarted");
            socket.off("teenPatti:sessionEnded");
        };
    }, []);


    // Timer countdown
    useEffect(() => {
        if (gamePhase === "betting" && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
            return () => clearTimeout(timer)
        } else if (timeLeft === 0 && gamePhase === "betting") {
            handleTimeUp()
        }
    }, [timeLeft, gamePhase])

    const handleTimeUp = () => {
        setGamePhase("revealing")
        // Simulate card dealing
        setTimeout(() => {
            setCards({
                player1: ["A♠", "K♠", "Q♠"],
                player3: ["J♥", "10♥", "9♥"],
            })
        }, 500)

        setTimeout(() => {
            setGamePhase("result")
        }, 2000)

        setTimeout(() => {
            resetGame()
        }, 5000)
    }

    const resetGame = () => {
        setTimeLeft(30)
        setGamePhase("betting")
        setSelectedBet(null)
        setCards({ player1: [], player3: [] })
    }

    const placeBet = (betType) => {
        setSelectedBet(betType)
    }

    const getWinnerColor = (winner) => {
        switch (winner) {
            case "player1":
                return "winner-player1"
            case "player3":
                return "winner-player3"
            case "tie":
                return "winner-tie"
            default:
                return "winner-default"
        }
    }

    return (
        <div className="teen-patti-container">
            {/* Header */}
            <div className="game-header">
                <h1 className="game-title">🏆 Teen Patti Royal 🏆</h1>
                <p className="game-subtitle">Place your bets and win big!</p>
            </div>

            {/* Main Game Area */}
            <div className="game-area">
                {/* Timer */}
                <div className="timer-section">
                    <div className={`timer-circle ${timeLeft <= 10 ? "pulse-timer" : ""}`}>
                        <div className="timer-content">
                            <div className="timer-number">{timeLeft}</div>
                            <div className="timer-label">seconds</div>
                        </div>
                    </div>
                </div>

                {/* Players Area */}
                <div className="players-container">
                    {/* Player 1 - Left Side */}
                    <div className="player-section player-left">
                        <div className="player-card player1-card">
                            <div className="player-header">
                                <span className="player-icon">👤</span>
                                <h3 className="player-name">Player 1</h3>
                            </div>
                            <div className="cards-container">
                                {cards.player1.length > 0
                                    ? cards.player1.map((card, index) => (
                                        <div key={index} className="card-flip">
                                            <div className="playing-card">{card}</div>
                                        </div>
                                    ))
                                    : [1, 2, 3].map((_, index) => <div key={index} className="card-back player1-back"></div>)}
                            </div>
                        </div>
                    </div>

                    {/* Player 3 - Right Side */}
                    <div className="player-section player-right">
                        <div className="player-card player3-card">
                            <div className="player-header">
                                <span className="player-icon">👤</span>
                                <h3 className="player-name">Player 2</h3>
                            </div>
                            <div className="cards-container">
                                {cards.player3.length > 0
                                    ? cards.player3.map((card, index) => (
                                        <div key={index} className="card-flip">
                                            <div className="playing-card">{card}</div>
                                        </div>
                                    ))
                                    : [1, 2, 3].map((_, index) => <div key={index} className="card-back player3-back"></div>)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-4">
                        <button style={{ backgroundColor: '#0ea5e9' }} className="btn andar-bahar-btn position-relative d-flex justify-content-center align-items-center w-100">Player 1</button>
                    </div>
                    <div className="col-4">
                        <button style={{ backgroundColor: '#eab308' }} className="btn andar-bahar-btn position-relative d-flex justify-content-center align-items-center w-100">Tie</button>
                    </div>
                    <div className="col-4">
                        <button style={{ backgroundColor: '#dc2626' }} className="btn andar-bahar-btn position-relative d-flex justify-content-center align-items-center w-100">Player 2</button>
                    </div>
                </div>

                {/* Bet Amount Display */}
                {selectedBet && gamePhase === "betting" && (
                    <div className="bet-display">
                        <div className="bet-info">
                            <span className="coin-icon">🪙</span>
                            <span className="bet-text">
                                Betting ₹{betAmount} on {selectedBet === "tie" ? "Tie" : selectedBet}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Game History - Bottom */}
            <div className="history-section">
                <h3 className="history-title">🕐 Last 8 Games</h3>
                <div className="history-grid">
                    {gameHistory.map((game) => (
                        <div key={game.id} className="history-item">
                            <span className="game-number">Game {game.id}</span>
                            <span className={`winner-badge ${getWinnerColor(game.winner)}`}>
                                {game.winner === "tie" ? "TIE" : game.winner.toUpperCase()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TeenPatti
