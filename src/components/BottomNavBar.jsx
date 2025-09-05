import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import PersonIcon from '@mui/icons-material/Person';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const createdBy = localStorage.getItem('createdBy'); // get from localStorage

  // Define tabs conditionally
  const tabs = createdBy === 'agent'
    ? [
      { label: 'Home', icon: <HomeIcon />, path: '/' },
      { label: 'Account', icon: <PersonIcon />, path: '/profile' }
    ]
    : [
      { label: 'Home', icon: <HomeIcon />, path: '/' },
      { label: 'Deposit', icon: <AccountBalanceWalletIcon />, path: '/deposit' },
      { label: 'Withdrawal', icon: <AssuredWorkloadIcon />, path: '/withdrawal' },
      { label: 'Account', icon: <PersonIcon />, path: '/profile' }
    ];

  // Determine selected tab index based on current path
  const currentValue = tabs.findIndex(tab => location.pathname.startsWith(tab.path));

  // Handle navigation
  const handleChange = (event, newValue) => {
    navigate(tabs[newValue].path);
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1000
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={currentValue}
        onChange={handleChange}
      >
        {tabs.map((tab, index) => (
          <BottomNavigationAction key={index} label={tab.label} icon={tab.icon} />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNavBar;
