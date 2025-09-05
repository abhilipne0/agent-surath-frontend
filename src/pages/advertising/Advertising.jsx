import React, { useEffect, useState } from 'react';
import './Advertising.css';
import advertising from './../../assets/addverties-banner.webp';

function Advertising() {
  const [os, setOS] = useState('unknown');

  useEffect(() => {
    const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      setOS('android');
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setOS('ios');
    } else {
      setOS('other');
    }
  }, []);

  const handleClick = () => {
    if (os === 'android') {
      window.location.href = 'https://sorath.online/downloads/surath.apk';
    } else {
      window.location.href = './';
    }
  };

  const buttonLabel = os === 'android' ? 'Download App Now' : 'Play Sorath Now';
  return (
    <div className="advertising-wrapper">
      <div className="advertise-upper">
        <img src={advertising} height={350} alt="Advertising Banner" />
      </div>
      <div style={{backgroundColor: '#13246D'}} className='text-white d-flex justify-content-center align-items-center'>
        <h6 className='mb-0 py-1' style={{fontSize: '12px'}}>फक्त जिंकण्याचा आनंद घ्या💰– बाकी सर्व आमची जबाबदारी!</h6>
      </div>
      <div className="advertise-lower">
        <div className='text-center mt-3 pb-1'>
            <h1 style={{fontSize: '33px'}} className='mb-0'>Download Sorath</h1>
            <h1 style={{fontSize: '33px'}}>App Now!</h1>
            <h6 className='my-3' style={{color: 'rgb(240, 233, 233)', fontSize: '14px'}}>Transparency, Trust, and Instant Payment!</h6>
        </div>
        <div className='mb-4'>
          <button
            className='btn w-100 btn-lg'
            onClick={handleClick}
            style={{
              backgroundColor: 'white',
              color: '#1C3887',
              fontWeight: '700',
              fontSize: '18px',
              padding: '10px 0px'
            }}
          >
             { os === 'android' ? <i className="bi bi-download me-3"></i> : <i class="bi bi-play-fill me-2 h2 mb-0"></i>}
            {buttonLabel}
          </button>
        </div>
        <div className='row align-items-center pb-3'>
          <div className="col-4 text-center position-relative">
            <h6 className='ms-2 mb-1'>300K<i class="bi bi-plus"></i></h6>
            <span style={{color: '#fefbfb9c'}}>Downloads</span>
            <div className="vertical-line" />
          </div>
          <div className="col-4 text-center position-relative">
            <h6 className='ms-2 mb-1'>4.5<i class="bi bi-star-fill ms-1" style={{fontSize: '15px'}}></i></h6>
            <span style={{color: '#fefbfb9c'}}>Rating</span>
            <div className="vertical-line" />
          </div>
          <div className="col-4 text-center">
            <h6 className='ms-2 mb-1'>256K<i class="bi bi-plus"></i></h6>
            <span style={{color: '#fefbfb9c'}}>Winners</span>
          </div>
        </div>
        <div className='text-center mt-4'>
            <button className='btn btn-dark p-0 px-1 pb-1 me-2 border border-light'>
                <div className='d-flex align-items-center'>
                    <i class="bi bi-apple h3 me-1 mb-0"></i>
                    <div style={{marginTop: '-7px'}}>
                        <span style={{fontSize: '10px'}}>Download on the</span>
                        <h6 className='mb-0' style={{marginTop: '-5px'}}>App Store</h6>
                    </div>
                </div>
            </button>
            <button className='btn btn-dark p-0 px-1 pb-1 ms-2 border border-light'>
                <div className='d-flex align-items-center'>
                    <i class="bi bi-caret-right-fill h2 me-1 mb-0"></i>
                    <div style={{marginTop: '-7px', textAlign: 'start'}}>
                        <span style={{fontSize: '10px'}}>GET IT ON</span>
                        <h6 className='mb-0' style={{marginTop: '-5px'}}>Google Play</h6>
                    </div>
                </div>
            </button>
        </div>
      </div>
    </div>
  );
}

export default Advertising;
