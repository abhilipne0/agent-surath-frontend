import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/reset.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/Style.css';

import Login from './pages/login/Login';
import Register from './pages/register/Register';
import ForgotPassword from './pages/forget-password/ForgotPassword';
import Home from './pages/home/Home';
import Deposite from './pages/deposite/Deposite';
import Withdrawal from './pages/withdrawal/Withdrawal';
import Profile from './pages/profile/Profile';
import AccountStatement from './pages/AccountStatement/AccountStatement';
import Advertising from './pages/advertising/Advertising';
import Surath from './pages/surath/Surath';

import GuestRoute from './routes/GuestRoute';
import AuthenticatedRoute from './routes/AuthenticatedRoute';

import MainLayout from './Layout/Layout';
import PlainLayout from './Layout/PlainLayout';

import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AndarBahar from './pages/andar-bahar/AndarBahar';
import DragonTiger from './pages/dragon-tiger/DragonTiger';
import GameLayout from './Layout/GameLayout';
import AutoDeposite from './pages/deposite/AutoDeposite';
import TeenPatti from './pages/teen-patti/TeenPatti';

function App() {
  const handleWhatsAppClick = () => {
    window.open("https://api.whatsapp.com/send?phone=918080678326", "_blank");
  };

  return (
    // <div className='d-flex justify-content-center mx-3 mt-5 text-center h4' style={{height: '100vh',  letterSpacing: '5px'}}>तांत्रिक अडचणीमुळे आम्ही काही वेळासाठी सेवा थांबवत आहोत. आम्ही लवकरच पुन्हा सुरू करू. तुमच्या सहकार्याबद्दल धन्यवाद.</div>
    <div className="desktop-third-width">
      <Routes>
        {/* Guest Routes */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        {/* <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} /> */}
        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />

        {/* Routes WITH Header */}
        <Route
          path="/"
          element={
            <AuthenticatedRoute>
              <MainLayout />
            </AuthenticatedRoute>
          }
        >
          <Route index element={<Home />} />
        </Route>

        {/* Routes WITHOUT Header */}
        <Route
          element={
            <AuthenticatedRoute>
              <PlainLayout />
            </AuthenticatedRoute>
          }
        >
          {/* <Route path="/deposit" element={<Deposite />} /> */}
          <Route path="/deposit" element={<AutoDeposite />} />
          <Route path="/statement" element={<AccountStatement />} />
          <Route path="/withdrawal" element={<Withdrawal />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="advertising/*" element={<Advertising />} />
        </Route>
        {/* Routes Gaming Header */}
        <Route
          element={
            <AuthenticatedRoute>
              <GameLayout />
            </AuthenticatedRoute>
          }
        >
          <Route path="/surath" element={<Surath />} />
          <Route path="/ander-bahar" element={<AndarBahar />} />
          <Route path="/dragon-tiger" element={<DragonTiger />} />
          <Route path="/teenpatti" element={<TeenPatti />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer />
      <div className="whatsapp-button" onClick={handleWhatsAppClick}>
        <WhatsAppIcon style={{ fontSize: "35px", color: "white" }} />
      </div>
    </div>
  );
}

export default App;
