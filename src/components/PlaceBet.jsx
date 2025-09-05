import React, { useState } from 'react';
import { Button, Col, Input, Row } from 'reactstrap';

const BET_VALUES = [10, 20, 50, 100, 200, 500];

function PlaceBet({ onSubmit, loading }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setAmount(e.target.value);
    setError('');
  };

  const handleSubmit = () => {
    const amountNum = Number(amount);
    if (!amount) {
      setError('Amount is required');
      return;
    }
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Enter a valid amount');
      return;
    }
    if (amountNum < 10) {
      setError('Bet amount must be above ₹10');
      return;
    }
    onSubmit(amountNum);
  };

  const handleButtonClick = (value) => {
    const currentAmount = Number(amount) || 0; // Parse the current amount, default to 0 if empty or invalid
    setAmount(currentAmount + value); // Add the clicked value to the current amount
    setError('');
  };

  return (
    <>
      <Row>
        <Col xs={6} sm={6} md={4}>
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={handleChange}
            invalid={!!error}
          />
          {error && <div className="text-danger">{error}</div>}
        </Col>
        <Col xs={6} sm={6} md={6}>
          <Button
            onClick={handleSubmit}
            style={{
              backgroundColor: 'green',
              border: '1px solid white',
              fontSize: '18px',
              width: '100px'
            }}
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              "Submit"
            )}
          </Button>
        </Col>
      </Row>

      <Row className='mt-2'>
        {BET_VALUES.map((value) => (
          <Col key={value} xs={4} sm={4} md={4}>
            <Button
              color="primary"
              className="bet-button w-100 mt-2 text-dark"
              onClick={() => handleButtonClick(value)}
            >
              {value}
            </Button>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default PlaceBet;