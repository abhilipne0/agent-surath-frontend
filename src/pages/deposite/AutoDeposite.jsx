import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Container, Modal, ModalBody, Spinner } from 'reactstrap';
import { message, Spin } from 'antd';
import { TextField, InputAdornment } from '@mui/material';
import { fetchDepositeHistory, getBankAccount, initiatePayment, resetPaymentLinks, upiPaymentHistory } from '../../store/deposite/depositeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Deposite.css';

function AutoDeposite() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { UpiDepositeList, loading, paymentLinks } = useSelector((state) => state.deposite);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const userPhone = localStorage.getItem('phone');

  const AMOUNT_VALUES = [100, 200, 500, 800, 1000];

  useEffect(() => {
    dispatch(upiPaymentHistory());
    dispatch(getBankAccount());
  }, [dispatch]);

  useEffect(() => {
    if (paymentLinks?.session_id) {
      // Inject SDK script dynamically if not loaded
      if (!window.EKQR) {
        const script = document.createElement('script');
        script.src = "https://cdn.ekqr.in/ekqr_sdk.js";
        script.onload = () => initEkqr(paymentLinks.session_id);
        document.body.appendChild(script);
      } else {
        initEkqr(paymentLinks.session_id);
      }
    }
  }, [paymentLinks]);

  const initEkqr = (sessionId) => {
    const paymentSDK = new window.EKQR({
      sessionId: sessionId,
      callbacks: {
        onSuccess: function (response) {
            message.success("Payment Successful");
            dispatch(resetPaymentLinks());
            dispatch(upiPaymentHistory());
        },
        onError: function (response) {
          message.error("Payment Failed");
          dispatch(resetPaymentLinks());
          dispatch(upiPaymentHistory());
        },
        onCancelled: function (response) {
          message.error("Payment Cancelled");
          dispatch(resetPaymentLinks());
          dispatch(upiPaymentHistory());
        }
      }
    });

    paymentSDK.pay();
  };

  const handleBack = () => navigate(-1);

  const handleAmountChange = (value) => {
    setAmount(value);
    setError('');
  };

  const isAmountValid = () => {
   const amt = parseFloat(amount);
    if (isNaN(amt) || amt < 100) {
      setError('Amount must be at least ₹1.');
      return false;
    }
    return true;
  };

  const handlePayNow = () => {
    if (!isAmountValid()) {
      message.error("Please enter valid amount");
      return;
    }

    const payload = {
      clientTxnId: "txn_" + Date.now(),
      amount: parseFloat(amount).toString(),
      productInfo: "Add Balance",
      customerName: userPhone || "Guest",
      customerEmail: `${userPhone}@example.com`,
      customerMobile: userPhone
    };

    dispatch(initiatePayment(payload));
  };

  return (
    <div>
      <Container fluid className='bg-blue py-1'>
        <div className="d-flex justify-content-between align-items-center">
          <button style={{ backgroundColor: '#ffffff1a', border: '1px solid #adaaaa' }} className="my-2 btn text-white p-0 px-1" onClick={handleBack}>
            <i className="bi bi-arrow-left-short h1"></i>
          </button>
          <button className="btn text-white border-0" style={{ backgroundColor: '#1C3887' }} onClick={() => setModalOpen(true)}>
            <i className="bi bi-play-btn-fill me-2"></i>Watch Video
          </button>
        </div>
      </Container>

      {/* YouTube Modal */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} centered>
        <ModalBody className="text-center">
          <button className="btn-close position-absolute top-0 end-0 m-2" onClick={() => setModalOpen(false)}></button>
          <h6 className="mb-3">How to Deposit Money</h6>
          <div className="embed-responsive embed-responsive-16by9">
            {/* <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/0a-egz98y_k"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe> */}
          </div>
        </ModalBody>
      </Modal>
      <Container fluid>
        <Card className="my-3">
          <CardBody className='secondary-back'>
            <div className="mb-3 text-center">
              <h6 className='mb-3'>Add Money</h6>
              <TextField
                type="number"
                style={{ width: '100px' }}
                placeholder='0.00'
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                variant="standard"
                fullWidth
                size="medium"
                error={Boolean(error)}
                helperText={error}
                InputProps={{
                  startAdornment: (
                    <InputAdornment style={{ fontSize: '24px' }} position="start">₹</InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: '20px',
                  }
                }}
              />
            </div>

            <div className="mt-3 d-flex justify-content-center">
              {AMOUNT_VALUES.map((value) => (
                <div className="p-1 my-2 text-center" key={value}>
                  <div
                    className='p-1'
                    style={{
                      backgroundColor: '#ffff',
                      width: '55px',
                      borderRadius: '5px',
                      border: '1px solid #f0efeb',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleAmountChange(value)}
                  >
                    <h6 className='mb-0'>{value}</h6>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="btn bg-green text-white mt-3 w-100 btn-lg d-flex justify-content-center align-items-center border-0"
              onClick={handlePayNow}
              type="button"
              disabled={loading}
            >
              <i className="bi bi-wallet2 me-2"></i>
              <h6 className='mb-0'>Deposite</h6>
            </button>

            <div className='mt-4 mb-2' style={{ borderBottom: '1px solid #d5deda' }}></div>
            <div className='mt-3'>
              <h6 className='text-secondary'>Note:</h6>
              <div className='d-flex ms-2' style={{ fontSize: '14px', fontWeight: '500' }}>
                <span>1.</span>
                <span className='ms-2'>Your balance will be added after successful payment.</span>
              </div>
              <div className='d-flex ms-2 mt-2' style={{ fontSize: '14px', fontWeight: '500' }}>
                <span>2.</span>
                <span className='ms-2'>Deposit only to listed accounts to avoid delays.</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <h6 className='my-3'>Recent Transactions</h6>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {UpiDepositeList?.length === 0 && !loading && (
            <div className="text-center text-muted my-3">No transactions found.</div>
          )}
          {UpiDepositeList && UpiDepositeList.map((item) => {
           const formattedDate = new Date(item.createdAt).toLocaleString('en-GB', {
          day: '2-digit',
          month: 'long',
          hour: 'numeric',
          minute: '2-digit',
        }).replace(',', '');

            return (
              <div>
                
                <div className='transaction-history' key={item.client_txn_id}>
                  <div className='d-flex justify-content-between'>
                    <div className='d-flex align-items-center'>
                      <div className={`rounded-circle text-center transaction-circle ${
                        item.status === 'success' ? 'bg-green' :
                        item.status === 'failure' ? 'bg-red' :
                        'bg-yellow'
                      }`}>
                        <i className={`bi ${
                          item.status === 'success' ? 'bi-check2-all' :
                          item.status === 'failure' ? 'bi-x' :
                          'bi-clock'
                        }`}></i>
                      </div>
                      <div className='ms-2'>
                        <span className='d-block text-secondary' style={{ fontSize: '14px' }}>Transaction ID</span>
                        <h6 className='mt-2'>{item.client_txn_id}</h6>
                      </div>
                    </div>
                    <div className='text-end'>
                      <span className='d-block text-secondary' style={{ fontSize: '14px' }}>{formattedDate}</span>
                      <h6 className='mt-2'>{`₹${item.amount}`}</h6>
                    </div>

                  </div>
                  {/* SHOW REMARK BELOW IF PRESENT */}
                  {item.remark && (
                    <div className='d-flex ms-5'>
                      <span className='d-block text-secondary' style={{ fontSize: '14px' }}>Reason :</span>
                      <span className='d-block text-danger ms-1' style={{ fontSize: '14px' }}>{item.remark}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="text-center my-3">
              <Spin />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default AutoDeposite;
