import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Form, FormGroup, Label, Input, Button, Spinner, Alert } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import advertising from './../../assets/addverties-banner.webp';
import pappulogo from './../../assets/surath_main_logo.webp';
import { message } from 'antd';
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth);

  const [formError, setFormError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      mobileNumber: '',
      password: '',
    },
    validationSchema: Yup.object({
      mobileNumber: Yup.string()
        .matches(/^[0-9]{10}$/, 'Invalid mobile number')
        .required('Mobile number is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      setFormError(null); // Reset local error state
      try {
        const response = await dispatch(
          loginUser({
            phone: values.mobileNumber,
            password: values.password,
          })
        ).unwrap(); // Ensures proper handling of the action result
        message.success('Logged in successfully');
        navigate('/')
      } catch (err) {
        message.error(`${err.message}`);
      }
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="signup-container">
      <div className="upper-section">
        <div className='d-flex mb-1 text-white align-content-center flex-column' style={{ marginLeft: '-10px' }}>
          {/* <h1 className='m-0' style={{fontWeight: '700'}}>SORATH</h1> */}
          <img src={pappulogo} width={130} style={{ zIndex: 10 }} alt="" />
          {/* <span>Gaming</span> */}
        </div>

        <img src={advertising} alt="ad" className="bottom-right-image" />
      </div>
      <div className="below-section">
        <div className="mx-4">
          <div>
            <div className="text-center mt-2 mb-3">
              <strong style={{ fontSize: '20px' }}>Welcome Back!</strong>
            </div>
            <Form onSubmit={formik.handleSubmit}>
              {/* Mobile Number */}
              <FormGroup className="mb-3">
                <Label for="mobileNumber mb-1">Mobile Number</Label>
                <div className="input-group">
                  <span className="input-group-text">+91</span>
                  <Input
                    id="mobileNumber"
                    name="mobileNumber"
                    type="number"
                    className={formik.touched.mobileNumber && formik.errors.mobileNumber ? 'is-invalid' : ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.mobileNumber}
                  />
                </div>
                {formik.touched.mobileNumber && formik.errors.mobileNumber && (
                  <div className="invalid-feedback d-block">{formik.errors.mobileNumber}</div>
                )}
              </FormGroup>

              {/* Password */}
              <FormGroup className="mb-3">
                <Label for="password mb-1">Password</Label>
                <div className="input-group">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className={formik.touched.password && formik.errors.password ? 'is-invalid' : ''}
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
                <div className='text-end'>
                  <Link to={'/forgot-password'}>Forget Password?</Link>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <div className="invalid-feedback d-block">{formik.errors.password}</div>
                )}
              </FormGroup>

              {/* <div className="text-center mb-2">
              <span>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>
                  Register here
                </Link>
              </span>
            </div> */}

              {/* Submit Button */}
              <Button type="submit" className="w-100 bg-blue border-0 mt-1" disabled={loading}>
                {loading ? <Spinner size="sm" /> : 'Login'}
              </Button>
              {/* <div className='d-flex align-items-center my-2'>
                <div className='border-bottom w-100 mt-1'></div>
                <h6 className='mx-2 text-secondary mb-0'>OR</h6>
                <div className='border-bottom w-100 mt-1'></div>
              </div> */}
            </Form>
            {/* <button type="button" class="btn bg-success w-100 d-flex align-items-center justify-content-center" style={{border: '2px solid #e8e2e1'}}>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none', fontSize: '19px' }}>
              Register Here <span style={{fontSize: '14px'}}>(New User)</span>
            </Link>
          </button> */}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
