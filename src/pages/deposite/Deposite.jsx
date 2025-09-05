import React, { useEffect, useState, useRef } from 'react';
import { Button, Card, CardBody, Col, Container, Input, Label, Modal, ModalBody, Row, Spinner } from 'reactstrap';
import { message, Spin, Table, Tag } from 'antd';
import { QRCodeCanvas } from 'qrcode.react';
import { Tabs, Tab, Box, Typography, TextField, InputAdornment } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addDeposit, fetchDepositeHistory, getBankAccount } from '../../store/deposite/depositeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Deposite.css'

function Deposit() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { depositeList, loading, bankAccount } = useSelector((state) => state.deposite);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [upiCode, setUPICode] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const AMOUNT_VALUES = [100, 200, 500, 800, 1000];

  const qrRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      screenshot: null,
      utrNumber: '',
    },
    validationSchema: Yup.object({
      screenshot: Yup.mixed()
        .required('Screenshot is required')
        .test('fileType', 'Only JPG or PNG files are allowed', (value) => {
          return value && ['image/jpeg', 'image/png'].includes(value.type);
        }),
      utrNumber: Yup.string()
        .required('UTR Number is required')
        .matches(/^\d{10,12}$/, 'UTR Number should be 10-12 digits'),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append('paymentScreenshot', values.screenshot);
      formData.append('utrNumber', values.utrNumber);
      formData.append('amount', amount); 
      formData.append('bankId', bankAccount._id); 
      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}: ${value}`);
      // }

      try {
        await dispatch(addDeposit(formData)).unwrap();
        message.success("Deposit added successfully!");
        
        resetForm(); // Reset Formik fields
        setAmount('');
        dispatch(fetchDepositeHistory());
      } catch (error) {
        message.error(error?.message || 'Failed to add deposit');
      }
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue('screenshot', file);
  };

  const isAmountValid = () => {
    if (amount < 100 || isNaN(amount)) {
      setError('Amount must be greater than 100.');
      return false;
    }
    return true;
  };

  const handleAmountChange = (value) => {
    setAmount(value);
    setError('');
  };

  const handleRechargeClick = () => {
    if (!bankAccount) {
      return message.error("Contact soppurt");
    }
    if (amount && isAmountValid() && bankAccount) {
      const url = `upi://pay?pa=${encodeURIComponent(bankAccount.upiId)}&pn=${encodeURIComponent(bankAccount.accountName)}&am=${amount}&cu=INR&tn=Payment`;
      setUPICode(url);
      setShowQRCode(true);
    } else {
      message.error("Please add valid amout");
    }
  };

  useEffect(() => {
    dispatch(fetchDepositeHistory());
    dispatch(getBankAccount())
  }, [dispatch]);

  const handleBack = () => {
    navigate(-1);  // Goes back to the previous page
  };

  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value)
      .then(() => {
        message.success("Successfully copy Upi Id");
        
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="">
        <Container fluid className='bg-blue py-1'>
          <div className="d-flex justify-content-between align-items-center">
            <button style={{backgroundColor: '#ffffff1a', border: '1px solid #adaaaa'}} type="submit" className=" my-2 btn text-white p-0 px-1" onClick={handleBack}>
              <i class="bi bi-arrow-left-short h1"></i>
            </button>
            <button type="submit" className="btn text-white border-0" style={{backgroundColor: '#1C3887'}} onClick={() => setModalOpen(true)}>
              <i class="bi bi-play-btn-fill me-2"></i>Watch Video
            </button>
          </div>
        </Container>
      <Container fluid>
        {/* YouTube Video Modal */}
        <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} centered>
          <ModalBody className="text-center">
            <button className="btn-close position-absolute top-0 end-0 m-2" onClick={() => setModalOpen(false)}></button>
            <h6 className="mb-3">How to Deposit Money</h6>
            {/* <div className="embed-responsive embed-responsive-16by9">
              <iframe 
                width="100%" 
                height="315" 
                src="https://www.youtube.com/embed/0a-egz98y_k" 
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
              </iframe>
            </div> */}
          </ModalBody>
        </Modal>
        {showQRCode ? (
          <>
            <Card className="my-3 pt-0" style={{ overflowY: 'hidden' }}>
              <CardBody className="text-center secondary-back py-0">
                <Box sx={{ width: '100%' }}>
                  <h6 className='mt-3'>Make Payment</h6>
                  <h5 className='mt-4'>₹{amount}</h5>
                  {showQRCode && upiCode && (
                    <div className='d-flex flex-column align-items-center'>
                      <QRCodeCanvas
                        value={upiCode}
                        size={200}
                        includeMargin={true}
                        level="H"
                        ref={qrRef}
                      />
                      <button
                        className="btn btn-sm btn-outline-primary mt-2"
                        onClick={() => {
                          const canvas = qrRef.current?.querySelector('canvas') || qrRef.current;
                          if (!canvas) {
                            message.error("QR not available to download");
                            return;
                          }
                         
                          const pngUrl = canvas
                            .toDataURL('image/png')
                            .replace('image/png', 'image/octet-stream');
                          const downloadLink = document.createElement('a');
                          downloadLink.href = pngUrl;
                          downloadLink.download = `qr-code-${amount}.png`;
                          document.body.appendChild(downloadLink);
                          downloadLink.click();
                          document.body.removeChild(downloadLink);
                        }}
                      >
                        Download QR
                      </button>
                    </div>
                  )}

                    <div className='d-flex justify-content-center'>
                      <h5 onClick={() => copyToClipboard(bankAccount?.upiId)}>{bankAccount?.upiId}</h5>
                      <i className="bi bi-clipboard ms-2" style={{ cursor: 'pointer' }} onClick={() => copyToClipboard(bankAccount?.upiId)}></i>
                    </div>
                    <p className=''>To complete your payment of ₹{amount}, please scan the QR code above.</p>
                </Box>
              </CardBody>
            </Card>
            <Card className='mt-3'>
              <CardBody className='secondary-back'>
                <form onSubmit={formik.handleSubmit}>
                  <h6 className='text-center'>Upload Screenshot</h6>
                  <Row className="mx-2 mt-3 text-start">
                    <div className="mb-3">
                      <Input
                        bsSize="lg"
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        onChange={handleFileChange}
                        className={formik.touched.screenshot && formik.errors.screenshot ? 'is-invalid' : ''}
                      />
                      {formik.touched.screenshot && formik.errors.screenshot && (
                        <div className="invalid-feedback">{formik.errors.screenshot}</div>
                      )}
                    </div>
                  </Row>
                  <Row className="mx-2 text-start">
                    <div className="mb-3">
                    <Label for="utrNumber" style={{fontSize: '14px'}} className="form-label text-secondary">
                      Payment UTR Number
                    </Label>
                      <Input
                        bsSize="lg"
                        type="text"
                        placeholder="Enter UTR Number"
                        name="utrNumber"
                        value={formik.values.utrNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={formik.touched.utrNumber && formik.errors.utrNumber ? 'is-invalid' : ''}
                      />
                      {formik.touched.utrNumber && formik.errors.utrNumber && (
                        <div className="invalid-feedback">{formik.errors.utrNumber}</div>
                      )}
                    </div>
                    <Button type="submit" className="w-100 bg-blue">
                      {loading ? <Spinner size="sm" /> : 'Submit'}
                    </Button>
                  </Row>
                </form>
              </CardBody>
            </Card>
          
          </>
        ) : (
          <Card className="my-3">
            <CardBody className='secondary-back'>
              <div className="mb-3 text-center">
               <h6 className='mb-3'>Add Money</h6>
                <TextField
                  type="number"
                  style={{width: '100px'}}
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
                      <InputAdornment style={{fontSize: '24px'}} position="start">₹</InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      fontSize: '20px', // Also ensures larger size
                    }
                  }}
                />
              </div>
              <div className="mt-3 d-flex justify-content-center">
                {AMOUNT_VALUES.map((value) => (
                  <div className="p-1 my-2 text-center" key={value}>
                    <div
                      className='p-1'
                      color="primary"
                      style={{ backgroundColor: '#ffff', width: '55px', borderRadius: '5px',  border: '1px solid #f0efeb',}}
                      onClick={() => handleAmountChange(value)}
                    >
                      <h6 className='mb-0'>{value}</h6>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn bg-green text-white mt-3 w-100 btn-lg d-flex justify-content-center align-items-center border-0"  onClick={handleRechargeClick} type="button">
                <i class="bi bi-wallet2 me-2"></i><h6 className='mb-0'>Deposite</h6>
              </button>
              <div className='mt-4 mb-2' style={{borderBottom: '1px solid #d5deda'}}></div>
              <div className='mt-3'>
                <h6 className='text-secondary'>Note:</h6>
                <div className='d-flex ms-2'style={{fontSize: '14px', fontWeight: '500'}}>
                  <span>1.</span>
                  <span className='ms-2'> After payment, please enter the UTR number and upload a screenshot to receive your balance quickly.</span>
                </div>
                <div className='d-flex ms-2 mt-2'style={{fontSize: '14px', fontWeight: '500'}}>
                  <span>2.</span>
                  <span className='ms-2'>Make sure to deposit only to the accounts listed above to avoid any delays</span>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        <h6 className='my-3'>Recent Transitions</h6>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {
            depositeList && depositeList.map((item) => {
              // Format date once per item
              const formattedDate = new Date(item.createdAt).toLocaleString('en-IN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              }).replace(',', ' at');
            
              return (
                <>
                
                <div className='transaction-history' key={item._id}>
                  <div className='d-flex align-items-center'>
                    <div className={`rounded-circle text-center transaction-circle ${
                      item.status === 'approved' ? 'bg-green' :
                      item.status === 'rejected' ? 'bg-red' :
                      'bg-yellow'
                    }`}>
                      <i className={`bi ${
                        item.status === 'approved' ? 'bi-check2-all' :
                        item.status === 'rejected' ? 'bi-x' :
                        'bi-clock'
                      }`}></i>
                    </div>
                    <div className='ms-2'>
                      <span className='d-block text-secondary' style={{ fontSize: '14px' }}>Transaction ID</span>
                      <h6 className='mt-2'>{item.utrNumber}</h6>
                    </div>
                  </div>
                  <div>
                    <div className='text-end'>
                      <span className='d-block text-secondary' style={{ fontSize: '14px' }}>
                        {formattedDate}
                      </span>
                      <h6 className='mt-2'>{`₹${item.amount}`}</h6>
                    </div>
                  </div>
                </div>
                </>
              );
            })
          }
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

export default Deposit
