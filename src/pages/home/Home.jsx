import React, { useEffect, useRef, useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import OfferModal from '../../components/offerModal/OfferModal';
import SorathBoxLogo from '../../assets/surath-box-logo.png';
import AndarBaharLogo from '../../assets/andar-bahar-logo.png';
import DragonTigetIcon from '../../assets/dragon-tiger.png';
import UpDown from '../../assets/7updown.png';
import refferAndEarn from '../../assets/refferandearn.webp';
import carousel2 from '../../assets/carousel2.webp';
import carousel3 from '../../assets/carousel3.webp';
import { getUserBalance } from '../../store/user/userSlice';
import { useDispatch } from 'react-redux';
// import Surath from '../surath/Surath'


function Home() {
  const userId = localStorage.getItem('userID')
  const [showModal, setShowModal] = useState(false);
  const [isWebView, setIsWebView] = useState(false);


  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Basic WebView detection logic
    const isAndroid = /Android/i.test(userAgent);
    const isInWebView =
      /SorathFlutterWebView/i.test(userAgent) || // Custom identifier
      /(wv|WebView)/i.test(userAgent) ||
      (document.referrer && document.referrer.startsWith('android-app://'));

    setIsWebView(isInWebView); // ← Set WebView state

    const hasSeenModal = sessionStorage.getItem('seen_offer_modal');
    if (userId && !hasSeenModal && !isInWebView && isAndroid) {
      setShowModal(true);
    }
  }, [userId]);

  const handleCloseModal = () => {
    sessionStorage.setItem('seen_offer_modal', 'true');
    setShowModal(false);
  };

  const openGame = (route) => {
    navigate(route)
  }

  useEffect(() => {
    dispatch(getUserBalance());
    // Reinitialize Bootstrap Carousel
    const el = document.getElementById('mobileCarousel');
    if (window.bootstrap && el) {
      const carousel = new window.bootstrap.Carousel(el, {
        interval: 2000,
        ride: 'carousel',
      });
    }
  }, []);

  return (
    <div className='bg-blue'>
      <div>
        {showModal && <OfferModal onClose={handleCloseModal} />}
      </div>
      {!isWebView && (
        <div
          style={{
            background: 'linear-gradient(to right, #3c1053, #ad5389)',
            padding: '5px 10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            animation: 'rainbowPulse 3s infinite alternate',
          }}
        >
          <b
            style={{
              fontSize: '15px',
              color: '#ffffff',
              textShadow: '1px 1px 3px #000',
              flex: 1,
            }}
          >
            बेहतर अनुभव के लिए ऐप डाउनलोड करें
          </b>

          <button
            style={{
              background: 'linear-gradient(45deg, #00f260, #0575e6, #f000ff)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0px 16px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginLeft: '15px',
              boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)',
              transition: 'transform 0.2s ease',
            }}
            onClick={() => window.location.href = 'https://pappuplaying.online/pappu-playing.apk'}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Download
          </button>
        </div>
      )}

      <div className="container py-1 p-0" style={{ height: '240px', marginTop: '-8px' }}>
        <div id="mobileCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="2000">
          <div className="carousel-indicators">
            <div data-bs-target="#mobileCarousel" data-bs-slide-to="0" className="active"></div>
            <div data-bs-target="#mobileCarousel" data-bs-slide-to="1"></div>
            <div data-bs-target="#mobileCarousel" data-bs-slide-to="2"></div>
          </div>

          <div className="carousel-inner text-center">
            <div className="carousel-item active">
              <div className="advertise-carousel shadow bg-white rounded">
                <img src={carousel3} className="img-fluid" style={{ width: '100%' }} alt="Slide 1" />
              </div>
            </div>
            <div className="carousel-item">
              <div className="advertise-carousel shadow bg-white rounded">
                <img src={carousel2} className="img-fluid" style={{ width: '100%' }} alt="Slide 2" />
              </div>
            </div>
            <div className="carousel-item">
              <div className="advertise-carousel shadow bg-white rounded">
                <img src={refferAndEarn} className="img-fluid" style={{ width: '100%' }} alt="Slide 3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-17px' }}>
        <div className="row">
          <div className="col-6 px-1">
            <div className="game-box mb-2">
              <img src={SorathBoxLogo} alt="" className="game-box-image" />
              <div className="game-box-overlay"></div>
              <div className="game-box-button-center">
                <button
                  className="btn btn-primary"
                  style={{ width: '100px' }}
                  onClick={() => openGame('/surath')}
                >
                  Play Now
                </button>
              </div>
              <div className="game-box-bottom-text">Live PAPPU Playing</div>
            </div>
          </div>
          <div className="col-6 px-1">
            <div className="game-box">
              <img src={DragonTigetIcon} alt="" className="game-box-image" />
              <div className="game-box-overlay"></div>
              <div className="game-box-button-center">
                <button
                  className="btn btn-primary"
                  style={{ width: '100px' }}
                  onClick={() => openGame('/dragon-tiger')}
                >
                  Play Now
                </button>
              </div>
              <div className="game-box-bottom-text">Live Dragon Tiger</div>
            </div>
          </div>
          <div className="col-6 px-1">
            <div className="game-box">
              <img src={AndarBaharLogo} alt="" className="game-box-image" />
              <div className="game-box-overlay"></div>
              <div className="game-box-button-center">
                <button
                  className="btn btn-primary"
                  style={{ width: '100px' }}
                  onClick={() => openGame('/ander-bahar')}
                >
                  Play Now
                </button>
              </div>
              <div className="game-box-bottom-text">Live Andar Bahar</div>
            </div>
          </div>
          <div className="col-6 px-1">
            {/* Live 7 Up Down */}
            <div className="game-box">
              <img src={UpDown} alt="" className="game-box-image" />
              <div className="game-box-overlay"></div>
              <div className="game-box-button-center">
                <button
                  className="btn btn-secondary"
                  onClick={() => openGame('/teenpatti')}
                >
                  Coming Soon
                </button>
              </div>
              <div className="game-box-bottom-text">Live Lucky 7</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;
