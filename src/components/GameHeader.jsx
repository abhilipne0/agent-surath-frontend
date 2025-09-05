import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container } from 'reactstrap'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { logout } from '../store/auth/authSlice';
import { message } from 'antd';
import {
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    Divider,
    Typography,
    Box,
} from "@mui/material";

function GameHeader() {
    const { balance } = useSelector((state) => state.user);
    const [userPhone, setUserPhone] = useState(null);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleBack = () => {
        navigate(-1);  // Goes back to the previous page
    };

    const handleLogOut = () => {
        message.success("Logged out successfully!");
        dispatch(logout());
        navigate("/login");
        setAnchorEl(null);
    };

    const handleRedirect = (path) => {
        navigate(path);
        setAnchorEl(null);
    };

    useEffect(() => {
        const phone = localStorage.getItem('phone');
        if (phone) {
            setUserPhone(phone);
        }
    }, []);

    return (
        <Container fluid className='bg-blue py-1'>
            <div className="d-flex justify-content-between align-items-center">
                {/* Back button */}
                <button
                    style={{ backgroundColor: '#ffffff1a', border: '1px solid #adaaaa' }}
                    type="submit"
                    className="my-2 btn text-white p-0 px-1"
                    onClick={handleBack}
                >
                    <i className="bi bi-arrow-left-short h1"></i>
                </button>

                {/* Balance + Dropdown */}
                <div className='text-light'>
                    <span className='d-block d-flex align-items-center justify-content-end'>
                        <AccountBalanceIcon className='me-1' style={{ fontSize: '20px' }} />
                        <b>{balance}.00</b>
                    </span>

                    {/* Modern Dropdown */}
                    <Box className="d-flex justify-content-end">
                        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0, ml: 1, fontSize: '18px' }}>
                            <u style={{ color: 'white' }} className='me-1'>{`${userPhone?.slice(0, 4)}******`}</u><i class="bi bi-person-fill text-dark"></i><i style={{ cursor: "pointer" }} className="bi bi-caret-down-fill text-dark"></i>
                        </IconButton>

                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={() => setAnchorEl(null)}
                            PaperProps={{
                                sx: {
                                    borderRadius: 3,
                                    mt: 1.5,
                                    minWidth: 220,
                                    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                                },
                            }}
                            transformOrigin={{ horizontal: "right", vertical: "top" }}
                            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                        >
                            <Box sx={{ px: 2, py: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Logged in as
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                    {/* {`${userPhone?.slice(0, 4)}******`} */}
                                    {userPhone}
                                </Typography>
                            </Box>
                            <Divider />

                            <MenuItem onClick={() => handleRedirect("/profile")}>
                                <PersonIcon fontSize="small" className="me-2" /> Profile
                            </MenuItem>

                            <MenuItem onClick={() => handleRedirect("/statement")}>
                                <ReceiptLongIcon fontSize="small" className="me-2" /> Account Statement
                            </MenuItem>

                            <Divider />

                            <MenuItem onClick={handleLogOut} sx={{ color: "red" }}>
                                <LogoutIcon fontSize="small" className="me-2" /> <b>Logout</b>
                            </MenuItem>
                        </Menu>
                    </Box>
                </div>
            </div>
        </Container>
    )
}

export default GameHeader
