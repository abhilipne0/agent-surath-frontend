import React, { useEffect, useState } from 'react';
import { useHMSActions, useHMSStore, selectPeers } from '@100mslive/react-sdk';
import api from '../../../api/api';
import './Stream.css';
import LazyLoad from 'react-lazyload';
import mail from './../../../assets/Mail.png';
import { useSelector } from 'react-redux';

const LiveIndicator = () => (
    <div className="live-indicator">
        <span className="dot"></span>
        Live
    </div>
);

function Stream({ sessioninfoLoading, animatedBox, showLiveStream }) {
    const hmsActions = useHMSActions();
    const peers = useHMSStore(selectPeers);
    const boxes = Array.from({ length: 50 }, (_, index) => index + 1);
    const { own, sessionRemainder } = useSelector((state) => state.game);
    const [showLive, setShowLive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [hasJoined, setHasJoined] = useState(false);

    const adminPeer = peers.find(peer => peer.name === 'Admin');

    // Join room
    const joinRoom = async () => {
        try {
            const result = await api.post('live/user/generate-token');
            if (result.data.token) {
                await hmsActions.join({
                    authToken: result.data.token,
                    userName: 'Viewer',
                });
                setHasJoined(true);
            }
        } catch (error) {
            console.error('Error joining the room:', error);
        }
    };

    useEffect(() => {
        // Initial join
        joinRoom();

        return () => {
            hmsActions.leave();
            setHasJoined(false);
        };
    }, [hmsActions]);

    // Auto rejoin when tab becomes visible again
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'visible' && !hasJoined) {
                await joinRoom();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [hasJoined]);

    // Toggle live stream view based on own/session info
    useEffect(() => {
        if (showLiveStream || own === "S") {
            setShowLive(true);
        }
    }, [showLiveStream, own]);

    // Handle loading state
    useEffect(() => {
        if (adminPeer) {
            setLoading(false);
        } else {
            const timer = setTimeout(() => setLoading(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [adminPeer]);

    return (
        <div className="col-12 text-center">
            {adminPeer && showLive ? (
                <div key={adminPeer.id} className="video-container" style={{ position: 'relative' }}>
                    <video
                        autoPlay
                        muted={adminPeer.isLocal}
                        ref={(ref) => {
                            if (ref) {
                                hmsActions.attachVideo(adminPeer.videoTrack, ref);
                            }
                        }}
                    ></video>
                    <LiveIndicator />
                </div>
            ) : (
                !loading && (
                    <div className="box-grid p-2">
                        {boxes.map((box) => (
                            <div key={box} className={`box ${box % 2 === 0 ? 'even' : 'odd'}`}>
                                <LazyLoad height={60} offset={100}>
                                    {!sessioninfoLoading ? (
                                        sessionRemainder && box <= sessionRemainder ? (
                                            box === sessionRemainder ? (
                                                <img
                                                    src={mail}
                                                    alt="mail"
                                                    className={`img-fluid ${animatedBox === box ? 'hidden-mail' : 'hidden-mail'}`}
                                                />
                                            ) : (
                                                <div style={{ height: '40px' }} />
                                            )
                                        ) : (
                                            <img src={mail} alt="mail" className="img-fluid" />
                                        )
                                    ) : (
                                        <div style={{ height: '40px' }} />
                                    )}
                                </LazyLoad>
                            </div>
                        ))}
                    </div>
                )
            )}
            {loading && <div className="video-container empty-box"></div>}
        </div>
    );
}

export default Stream;
