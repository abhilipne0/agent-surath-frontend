// src/components/PlainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavBar from '../components/BottomNavBar';

const PlainLayout = () => (
  <div>
    <main className="main-content with-bottom-padding">
      <Outlet />
    </main>
    <BottomNavBar />
  </div>
);

export default PlainLayout;
