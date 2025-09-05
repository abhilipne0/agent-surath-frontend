import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Container,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  getWithdrawalHistory,
  withdrawRequest,
  addBankAccount,
  removeBankAccount,
  getBackAccounts,
} from '../../store/withdrawal/withdrawalSlice';
import { getUserBalance } from '../../store/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { Spin, Table, Tag, Popconfirm, message } from 'antd';
import { TextField, InputAdornment } from '@mui/material';
import AddAccount from '../../components/AddAccount';

function Withdrawal() {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [error, setError] = useState('');
  const [accountModal, setAccountModal] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    withdrawalHistory,
    bankAccounts,
    loadingGetHistory,
    loadingGetBankAccounts,
    loadingWithdrawRequest,
  } = useSelector((state) => state.withdrawal);
  const { balance, bonusAmount, availableBalance } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getBackAccounts());
    dispatch(getWithdrawalHistory());
    dispatch(getUserBalance());
  }, [dispatch]);

  const toggleAccountModal = () => setAccountModal(!accountModal);

  const handleBack = () => navigate(-1);

  const handleAmountChange = (value) => {
    setWithdrawAmount(value);
    setError('');
  };

  const validateAmount = (amount) => {
    if (amount < 200) {
      setError('Withdrawal amount must be more than ₹200.');
      return false;
    }
    if (amount > 10000) {
      setError('Withdrawal amount must be less than ₹10,000.');
      return false;
    }
    return true;
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
  
    // Validate bank account selection
    if (!selectedBankId) {
      setError('Please select a bank account.');
      message.error("Please select a bank account.");
      return; // ⛔ Prevent further execution if bank is not selected
    }
  
    // Validate amount
    if (!validateAmount(amount)) {
      return; // ⛔ Prevent further execution if amount is invalid
    }
  
    // Proceed with withdrawal
    dispatch(withdrawRequest({ bankAccountId: selectedBankId, amount }))
      .unwrap()
      .then(() => {
        message.success("Withdrawal request submitted!");
        dispatch(getWithdrawalHistory());
        dispatch(getUserBalance());
        setWithdrawAmount('');
        setError('');
      })
      .catch((err) => {
        message.error(err?.message || "Withdrawal failed");
      });
  };
  

  const handleAddBank = (bankDetails) => {
    const payload = {
      accountHolderName: bankDetails.accountName,
      accountNumber: bankDetails.accountNumber,
      ifscCode: bankDetails.ifscCode,
      bankName: bankDetails.bankName,
      upiId: bankDetails.upiId,
    };

    dispatch(addBankAccount(payload))
      .unwrap()
      .then(() => {
        message.success("Bank account added!");
        dispatch(getBackAccounts());
        toggleAccountModal();
      });
  };

  const handleRemoveBank = (id) => {
    dispatch(removeBankAccount(id))
      .unwrap()
      .then(() => {
        message.success("Bank account deleted!");
        dispatch(getBackAccounts());
      })
      .catch(() => {
        message.error("Failed to delete bank account.");
      });
  };

  return (
    <div>
      <Container fluid className="bg-blue py-1">
        <div className="d-flex justify-content-between align-items-center">
          <button style={{backgroundColor: '#ffffff1a', border: '1px solid #adaaaa'}} type="submit" className=" my-2 btn text-white p-0 px-1" onClick={handleBack}>
              <i class="bi bi-arrow-left-short h1"></i>
            </button>
          <Button className="text-white border-0" style={{ backgroundColor: '#1C3887' }} onClick={() => setVideoModalOpen(true)}>
            <i className="bi bi-play-btn-fill me-2"></i>Watch Video
          </Button>
        </div>
      </Container>

      <Container fluid>
        <Card className="my-3">
          <CardBody className="secondary-back">
            <div className="text-center mb-3">
              <h6 className='mb-4'>Withdrawal Money</h6>
              <TextField
                type="number"
                style={{width: '100px'}}
                placeholder='0.00'
                value={withdrawAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                variant="standard"
                fullWidth
                size="medium"
                error={!!error}
                helperText={error}
                InputProps={{
                  startAdornment: <InputAdornment style={{fontSize: '24px'}} position="start">₹</InputAdornment>,
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: '20px', // Also ensures larger size
                  }
                }}
              />
              <div className="text-muted mt-3" style={{ fontSize: '12px' }}>
                <i className="bi bi-info-circle me-1"></i>Withdrawal amount must be between ₹200 and ₹10,000.
              </div>
              <button className="mt-4 mb-3 btn bg-red text-white w-100 btn-lg border-0 d-flex justify-content-center align-items-center" onClick={handleWithdraw}>
                <i className="bi bi-wallet2 me-2"></i><h6 className='mb-0'>Withdraw</h6>
              </button>
            </div>

            <hr />

            <div className="my-3">
              <h6 className="text-secondary">Select Bank Account:</h6>
              <div className='mt-3'>
                <Spin spinning={loadingGetBankAccounts}>
                  {bankAccounts?.length > 0 ? (
                    bankAccounts.map((account) => (
                      <Card key={account._id} className="my-2">
                        <CardBody className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <input
                              type="radio"
                              name="bank"
                              checked={selectedBankId === account._id}
                              onChange={() => setSelectedBankId(account._id)}
                              style={{ width: 18, height: 18, marginRight: 10 }}
                            />
                            <div>
                              <div>A.C. Number : <strong className='ms-1'>{account.accountNumber}</strong></div>
                              <div>Name : <strong className='ms-1'>{account.accountHolderName}</strong></div>
                            </div>
                          </div>
                          <Popconfirm
                            title="Delete account?"
                            onConfirm={() => handleRemoveBank(account._id)}
                            okText="Yes"
                            cancelText="No"
                            placement="topRight"
                          >
                            <i className="bi bi-trash3 text-danger" style={{ cursor: 'pointer', fontSize: 18 }}></i>
                          </Popconfirm>
                        </CardBody>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center my-4">
                      <p>No bank accounts found.</p>
                    </div>
                  )}
                </Spin>
              </div>
                <button className='btn btn-outline-primary w-100 mt-3 bg-blue text-white' onClick={toggleAccountModal}>
                  <i class="bi bi-plus-lg me-2"></i>Add Bank Account
                </button>
            </div>
          </CardBody>
        </Card>

        <h6 className='my-3'>Recent Transitions</h6>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {
            withdrawalHistory && withdrawalHistory.map((item) => {
              // Format date once per item
              const formattedDate = new Date(item.date).toLocaleString('en-IN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              }).replace(',', ' at');
            
              return (
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
                      <h6 className='mt-2'>{item.id}</h6>
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
              );
            })
          }
          {loadingWithdrawRequest && (
            <div className="text-center my-3">
              <Spin />
            </div>
          )}
        </div>

        {/* <Card>
          <CardBody className="p-0">
            <Table
              dataSource={withdrawalHistory}
              columns={columns}
              rowKey="_id"
              size="small"
              scroll={{ x: true }}
              loading={loadingGetHistory}
            />
          </CardBody>
        </Card> */}
      </Container>

      {/* Add Account Modal */}
      <Modal isOpen={accountModal} toggle={toggleAccountModal}>
        <ModalHeader toggle={toggleAccountModal}>Add Bank Account</ModalHeader>
        <ModalBody>
          <AddAccount onSubmit={handleAddBank} />
        </ModalBody>
      </Modal>

      {/* Video Modal */}
      <Modal isOpen={videoModalOpen} toggle={() => setVideoModalOpen(false)} size="lg">
        <ModalHeader toggle={() => setVideoModalOpen(false)}>How to Withdraw</ModalHeader>
        <ModalBody className="text-center">
          {/* <iframe
            width="100%"
            height="400"
            src="https://www.youtube.com/embed/A9d7tOO5mGY"
            title="How to Withdraw"
            frameBorder="0"
            allowFullScreen
          ></iframe> */}
        </ModalBody>
      </Modal>
    </div>
  );
}

export default Withdrawal;
