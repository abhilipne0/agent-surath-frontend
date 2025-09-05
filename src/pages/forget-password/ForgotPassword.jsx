import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Form, FormGroup, Label, Input, Button, Spinner } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { forgotePasswordOtp, resetPassword } from '../../store/user/userSlice';
import { useNavigate } from 'react-router-dom';
import advertising from './../../assets/addverties-banner.webp'; 
import { message } from 'antd';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Mobile Number, 2: OTP, Password & Confirm Password
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill('')); // Array to store OTP digits
  const [otpError, setOtpError] = useState(''); // For OTP-specific error
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 

  const dispatch = useDispatch();
  const { forgotLoading } = useSelector((state) => state.user);
  const navigate = useNavigate()

  // Handle OTP digit changes
  const handleOtpChange = (value, index) => {
    if (/^\d*$/.test(value)) { // Allow only digits
      const updatedOtp = [...otp];
      updatedOtp[index] = value.slice(-1); // Only take the last character
      setOtp(updatedOtp);

      // Automatically move to next input if not empty
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }

      // Clear OTP error when the user starts entering
      setOtpError('');
    }
  };

  // Handle Backspace and navigation
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  // Step 1: Mobile Number and Request OTP
  const mobileForm = useFormik({
    initialValues: {
      mobileNumber: '',
    },
    validationSchema: Yup.object({
      mobileNumber: Yup.string()
        .matches(/^[0-9]{10}$/, 'Invalid mobile number')
        .required('Mobile number is required'),
    }),
    onSubmit: async (values) => {
      try {
        dispatch(forgotePasswordOtp(values.mobileNumber))
          .unwrap()
          .then(() => {
            message.success("OTP sent to your mobile number.");
            setMobileNumber(values.mobileNumber);
            setStep(2); // Proceed to OTP and reset password step
          })
          .catch((error) => {
            message.error(error.message);
          });
      } catch (error) {
        message.error("Failed to send OTP.");
      }
    },
  });

  // Step 2: Enter OTP, New Password, and Confirm Password
  const otpForm = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values) => {
      const otpValue = otp.join(''); // Combine OTP digits into a single string

      // Validate OTP length
      if (otpValue.length < 6) {
        setOtpError('Please enter a valid 6-digit OTP.');
        return;
      }

      try {
        dispatch(resetPassword({ phone: mobileNumber, resetOTP: otpValue, newPassword: values.password }))
          .unwrap()
          .then(() => {
            message.success("Password reset successfully. You can now log in.");
            setStep(1); // Reset flow to initial state
            navigate('/login')

          })
          .catch((error) => {
            message.error(error.message || 'Failed to reset password.');
          });
      } catch (error) {
        message.error("Failed to reset password.");
      }
    },
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleBack = () => {
    navigate('/login')
  };

  return (
    <div className="signup-container">
      <div className="upper-section">
        <button style={{backgroundColor: '#ffffff1a'}} type="submit" className="btn text-white p-0 px-1" onClick={handleBack}>
          <i class="bi bi-arrow-left-short h1"></i>
        </button>
        <div className='d-flex mb-1 text-white align-content-center flex-column'>
          <h1 className='m-0' style={{fontWeight: '700'}}>SORATH</h1>
          <span>Gaming</span>
        </div>

        <img src={advertising} alt="ad" className="bottom-right-image" />
      </div>
    <div className="below-section">
      <div className="mx-4">
        <div>
          <div className="text-center mt-2 mb-3">
            <strong style={{fontSize: '20px'}}>Reset Password</strong>
          </div>

          {/* Step 1: Mobile Number */}
          {step === 1 && (
            <Form onSubmit={mobileForm.handleSubmit}>
              <FormGroup>
                <Label for="mobileNumber">Mobile Number</Label>
                <Input
                  size="lg"
                  id="mobileNumber"
                  name="mobileNumber"
                  type="number"
                  className={
                    mobileForm.touched.mobileNumber && mobileForm.errors.mobileNumber ? 'is-invalid' : ''
                  }
                  onChange={mobileForm.handleChange}
                  onBlur={mobileForm.handleBlur}
                  value={mobileForm.values.mobileNumber}
                />
                {mobileForm.touched.mobileNumber && mobileForm.errors.mobileNumber && (
                  <div className="invalid-feedback d-block">{mobileForm.errors.mobileNumber}</div>
                )}
              </FormGroup>
              <Button type="submit" className="w-100 bg-blue" disabled={forgotLoading}>
                {forgotLoading ? <Spinner size="sm" /> : 'Get OTP'}
              </Button>
            </Form>
          )}

          {/* Step 2: OTP, Password and Confirm Password */}
          {step === 2 && (
            <Form onSubmit={otpForm.handleSubmit}>
              <FormGroup>
                <Label>Enter OTP</Label>
                <div className="d-flex justify-content-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-input-${index}`}
                      type="number"
                      maxLength="1"
                      className="form-control m-1 otp-input input-group-lg"
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onFocus={(e) => e.target.select()}
                      style={{ width: '45px', height: '50px', textAlign: 'center', fontSize: '20px' }}
                    />
                  ))}
                </div>
                {otpError && <div className="invalid-feedback d-block">{otpError}</div>}
              </FormGroup>

              <FormGroup className="mb-3">
                <Label for="password">New Password</Label>
                <div className="input-group">
                  <Input
                    size="lg"
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className={
                      otpForm.touched.password && otpForm.errors.password ? 'is-invalid' : ''
                    }
                    onChange={otpForm.handleChange}
                    onBlur={otpForm.handleBlur}
                    value={otpForm.values.password}
                  />
                  <div className="input-group-append">
                    <span
                      className="input-group-text"
                      onClick={togglePasswordVisibility}
                      style={{ cursor: 'pointer', height: '48px'}}
                    >
                      {showPassword ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}
                    </span>
                  </div>
                </div>
                {otpForm.touched.password && otpForm.errors.password && (
                  <div className="invalid-feedback d-block">{otpForm.errors.password}</div>
                )}
              </FormGroup>
              <FormGroup className="mb-3">
                <Label for="confirmPassword">Confirm Password</Label>
                <div className="input-group">
                  <Input
                    size="lg"
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={
                      otpForm.touched.confirmPassword && otpForm.errors.confirmPassword ? 'is-invalid' : ''
                    }
                    onChange={otpForm.handleChange}
                    onBlur={otpForm.handleBlur}
                    value={otpForm.values.confirmPassword}
                  />
                  <div className="input-group-append">
                    <span
                      className="input-group-text"
                      onClick={toggleConfirmPasswordVisibility}
                      style={{ cursor: 'pointer', height: '48px'}}
                    >
                      {showConfirmPassword ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}
                    </span>
                  </div>
                </div>
                {otpForm.touched.confirmPassword && otpForm.errors.confirmPassword && (
                  <div className="invalid-feedback d-block">{otpForm.errors.confirmPassword}</div>
                )}
              </FormGroup>

              <Button type="submit" className="w-100 bg-blue" disabled={forgotLoading}>
                {forgotLoading ? <Spinner size="sm" /> : 'Reset Password'}
              </Button>
            </Form>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default ForgotPassword;
