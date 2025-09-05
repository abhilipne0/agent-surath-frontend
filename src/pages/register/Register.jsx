import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Form, FormGroup, Label, Input as ReactstrapInput, Button } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, verifyOtp, resendOtp } from '../../store/auth/authSlice';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Typography, Input, message } from 'antd';
import ReactPinInput from 'react-pin-input';
import advertising from './../../assets/addverties-banner.webp';
import pappulogo from './../../assets/surath_main_logo.webp';

const { Title } = Typography;

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60); // Countdown timer for Resend OTP

  const [searchParams] = useSearchParams();
  const referCodeFromURL = searchParams.get('refercode'); // Extract referCode from URL

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { otpVisible, loading, resendLoading, error } = useSelector((state) => state.auth);

  const handleBack = () => {
    window.location.reload();
  };

  const formik = useFormik({
    initialValues: {
      mobileNumber: '',
      password: '',
      confirmPassword: '',
      referCode: '',
    },
    validationSchema: Yup.object({
      mobileNumber: Yup.string()
        .matches(/^[0-9]{10}$/, 'Invalid mobile number')
        .required('Mobile number is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
      referCode: Yup.string().optional(),
    }),
    onSubmit: (values) => {
      const requestBody = {
        phone: values.mobileNumber,
        password: values.password,
        referralCode: values.referCode,
      };
      dispatch(registerUser(requestBody))
      .unwrap()
      .then(() => {
        message.success("OTP sent successfully");
      })
      .catch((error) => {
        message.error(error.message);
        console.error('Registration error:', error);
      });
    },
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    const requestBody = {
      phone: formik.values.mobileNumber,
      otp: otp,
    };
    const result = await dispatch(verifyOtp(requestBody));

    if (verifyOtp.fulfilled.match(result)) {
      navigate('/'); // Navigate to the home page after successful OTP verification
    }
  };

  const handleResendOtp = () => {
    const requestBody = { phone: formik.values.mobileNumber };
    dispatch(resendOtp(requestBody));
    setTimer(60); // Reset timer to 60 seconds after resending
  };

  useEffect(() => {
    if (otpVisible && timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown); // Clear the interval on unmount
    }
  }, [otpVisible, timer]);

  useEffect(() => {
    if (referCodeFromURL) {
      formik.setFieldValue('referCode', referCodeFromURL);
    }
  }, [referCodeFromURL]);

  return (
    <div className="signup-container">
      <div className="upper-section">
        {
          otpVisible && <>
             <button style={{backgroundColor: '#ffffff1a'}} type="submit" className="btn text-white p-0 px-1" onClick={handleBack}>
                <i class="bi bi-arrow-left-short h1"></i>
              </button>
          </>
        }
        <div className='d-flex mb-1 text-white align-content-center flex-column' style={{marginLeft: '-10px'}}>
          {/* <h1 className='m-0'>PAPPU</h1> */}
          <img src={pappulogo} width={130} style={{zIndex: 10}} alt="" />
        </div>

        <img src={advertising} alt="ad" className="bottom-right-image" />
      </div>
      <div className="below-section">
      <div className="p-4 pt-2">
          <div className="text-center mb-3">
            {/* <h3>{otpVisible ? 'Enter OTP' : 'Register'}</h3> */}
            <strong style={{fontSize: '22px'}}>{otpVisible ? 'Enter OTP' : 'Register'}</strong>
          </div>
          {!otpVisible ? (
            <>
            <Form onSubmit={formik.handleSubmit}>
              <FormGroup className="mb-3">
                <Label for="mobileNumber">Mobile Number</Label>
                <div className="input-group">
                  <span className="input-group-text">+91</span>
                  <ReactstrapInput
                    id="mobileNumber"
                    name="mobileNumber"
                    type="number"
                    className={
                      formik.touched.mobileNumber && formik.errors.mobileNumber ? 'is-invalid' : ''
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.mobileNumber}
                  />
                </div>
                {formik.touched.mobileNumber && formik.errors.mobileNumber && (
                  <div className="invalid-feedback d-block">{formik.errors.mobileNumber}</div>
                )}
              </FormGroup>

              <FormGroup className="mb-3">
                <Label for="password">Password</Label>
                <div className="input-group">
                  <ReactstrapInput
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className={
                      formik.touched.password && formik.errors.password ? 'is-invalid' : ''
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                  <div className="input-group-append">
                    <span
                      className="input-group-text"
                      onClick={togglePasswordVisibility}
                      style={{ cursor: 'pointer' }}
                    >
                      {showPassword ? <i class="bi bi-eye"></i> : <i class="bi bi-eye-slash"></i>}
                    </span>
                  </div>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <div className="invalid-feedback d-block">{formik.errors.password}</div>
                )}
              </FormGroup>

              <FormGroup className="mb-3">
                <Label for="confirmPassword">Confirm Password</Label>
                <div className="input-group">
                  <ReactstrapInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={
                      formik.touched.confirmPassword && formik.errors.confirmPassword
                        ? 'is-invalid'
                        : ''
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                  />
                  <div className="input-group-append">
                    <span
                      className="input-group-text"
                      onClick={toggleConfirmPasswordVisibility}
                      style={{ cursor: 'pointer' }}
                    >
                      {showConfirmPassword ? <i class="bi bi-eye"></i> : <i class="bi bi-eye-slash"></i>}
                    </span>
                  </div>
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <div className="invalid-feedback d-block">{formik.errors.confirmPassword}</div>
                )}
              </FormGroup>

                <FormGroup className="mb-3">
                  <Label for="referCode">Refer Code (Optional)</Label>
                  <ReactstrapInput
                    id="referCode"
                    name="referCode"
                    type="text"
                    className={
                      formik.touched.referCode && formik.errors.referCode ? 'is-invalid' : ''
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.referCode}
                    disabled={!!referCodeFromURL} // Disable if referCode is present in URL
                  />
                  {formik.touched.referCode && formik.errors.referCode && (
                    <div className="invalid-feedback d-block">{formik.errors.referCode}</div>
                  )}
                </FormGroup>

                <Button type="submit" className="w-100 bg-blue mt-3" size="lg">
                {loading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  ) : (
                    'Register'
                  )}
                </Button>
              </Form>
              <div className="text-center mt-3 mb-3">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
                    Login here
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmitOtp} className="mt-2">
            <ReactPinInput
              length={6} // Number of OTP digits
              type="numeric"
              onChange={(value) => setOtp(value)} // Update OTP state
              autoSelect={true} // Auto-focus next input
              focus
              inputStyle={{
                border: '1px solid #ced4da',
                borderRadius: '4px',
                width: '43px',
                height: '45px',
                textAlign: 'center',
                margin: '5px',
              }}
              inputFocusStyle={{
                border: '2px solid #007bff',
              }}
            />
            <button type="submit" className="btn btn bg-blue text-white mt-3 w-100">
              {loading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                'Verify OTP'
              )}
            </button>
  
            <button
              type="button"
              className="btn btn-link mt-3 w-100"
              onClick={handleResendOtp}
              disabled={timer > 0 || resendLoading}
            >
              {resendLoading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : timer > 0 ? (
                `Resend OTP in ${timer}s`
              ) : (
                'Resend OTP'
              )}
            </button>
          </form>
          )}
        </div>

      </div>
    </div>
  );
}

export default Register;
