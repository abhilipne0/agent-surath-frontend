import React from 'react';
import './OfferModal.css';
import advertising from './../../assets/addverties-banner.webp';

const OfferModal = ({ onClose }) => {

  const handleClick = () => {
    window.location.href = 'https://pappuplaying.online/pappu-playing.apk';
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className='text-end' style={{marginTop: '-10px'}}>
          <i class="bi bi-x me-1" style={{fontSize: '35px'}} onClick={onClose}></i>
        </div>
        <div className='ms-5'>
          <img src={advertising} height={250} alt="Advertising Banner" />
        </div>
        <div style={{ backgroundColor: 'rgb(2, 173, 207)' }} className='text-white d-flex justify-content-center align-items-center'>
          <h6 className='mb-0 py-1' style={{ fontSize: '12px' }}>फक्त जिंकण्याचा आनंद घ्या💰– बाकी सर्व आमची जबाबदारी!</h6>
        </div>
        <div>
          <h4 className='mb-0 py-1 mt-2' style={{ fontSize: '12px' }}>खाली दिलेल्या 'Download App' बटणावर क्लिक करा</h4>
          <h4 className='mb-0 py-1' style={{ fontSize: '12px' }}>आणि आत्ताच डाउनलोड करा Pappu Playing अ‍ॅप!</h4>

        </div>
        <div className='mb-4 mx-3 mt-3'>
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
            <i className="bi bi-download me-3"></i> Download App Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferModal;
