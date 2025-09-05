import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/auth/authSlice";
import clapsound from "./../assets/clap-sound.mp3";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import advertisingface from "./../assets/Pappu logo face1.webp";
import advertisingtext from "./../assets/Pappu logo name.webp";
import { message } from "antd";
import {
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    Divider,
    Typography,
    Box,
} from "@mui/material";

function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const audioRef = useRef(null);
    const { balance } = useSelector((state) => state.user);
    const [userPhone, setUserPhone] = useState(null);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const notifications = [
        "Share and earn! Get ₹30 for every friend who signs up using your link.",
    ];

    const handleRedirect = (path) => {
        navigate(path);
        setAnchorEl(null);
    };

    const handleLogOut = () => {
        message.success("Logged out successfully!");
        dispatch(logout());
        navigate("/login");
        setAnchorEl(null);
    };

    useEffect(() => {
        const phone = localStorage.getItem("phone");
        if (phone) {
            setUserPhone(phone);
        }
    }, []);

    return (
        <div className="bg-blue">
            <audio ref={audioRef} src={clapsound} preload="auto" />
            <div className="container-fluid pt-2 text-white">
                <div className="d-flex justify-content-between align-items-start">
                    {/* Brand */}
                    <div className="d-flex">
                        <img src={advertisingface} height={45} alt="" />
                        <img src={advertisingtext} height={45} alt="" />
                    </div>

                    {/* Right side */}
                    <div className="text-end">
                        <span className="d-block d-flex align-items-center justify-content-end">
                            <AccountBalanceIcon
                                className="me-1"
                                style={{ fontSize: "20px" }}
                            />
                            <b>{balance}.00</b>
                        </span>

                        {/* New Modern Dropdown */}
                        <Box>
                            <IconButton
                                onClick={(e) => setAnchorEl(e.currentTarget)}
                                sx={{ p: 0, ml: 1 }}
                            >
                                <Avatar sx={{ bgcolor: "#1976d2", height: 25, width: 25 }}>
                                    <PersonIcon sx={{ fontSize: 18 }} />
                                </Avatar>
                                <i style={{ cursor: "pointer", fontSize: '18px' }} className="bi bi-caret-down-fill text-dark ms-1"></i>
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
                                    <PersonIcon fontSize="small" className="me-2" />
                                    Profile
                                </MenuItem>

                                <MenuItem onClick={() => handleRedirect("/statement")}>
                                    <ReceiptLongIcon fontSize="small" className="me-2" />
                                    Account Statement
                                </MenuItem>

                                <Divider />
                                <MenuItem onClick={handleLogOut} sx={{ color: "red" }}>
                                    <LogoutIcon fontSize="small" className="me-2" />
                                    <b>Logout</b>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </div>
                </div>

                {/* Deposit / Withdraw */}
                <div className="w-100 d-flex mt-1">
                    <Link
                        to={"/deposit"}
                        className="btn btn-primary w-50 me-2 py-1 deposite-button d-flex align-items-center p-0 justify-content-center"
                        style={{ backgroundColor: "#00C000" }}
                    >
                        <i
                            className="bi bi-piggy-bank me-2"
                            style={{ fontSize: "1.5rem" }}
                        ></i>
                        DEPOSIT
                    </Link>
                    <Link
                        to={"/withdrawal"}
                        className="btn btn-primary w-50 withdrawal-button d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: "#FF0000" }}
                    >
                        <AssuredWorkloadIcon className="me-1" style={{ fontSize: "25px" }} />
                        WITHDRAWAL
                    </Link>
                </div>

                {/* Notification Scroll */}
                <div className="scroll-container">
                    <div className="scroll-content">
                        {notifications.map((notification, index) => (
                            <div key={index} className="scroll-item notification">
                                {notification}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
