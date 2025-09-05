import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "../../store/user/userSlice";
import { useNavigate } from "react-router-dom";
import { message, Spin } from "antd";
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  IconButton,
  Button,
} from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShareIcon from "@mui/icons-material/Share";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { QRCodeCanvas } from "qrcode.react";
import "./profile.css";

function Profile() {
  const dispatch = useDispatch();
  const { userInfo, loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const createdBy = localStorage.getItem('createdBy')

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">❌ Error loading profile.</Typography>;
  }

  if (!userInfo) {
    return <Typography>⚠️ No data available.</Typography>;
  }

  const referralLink = `${window.location.origin}/register?refercode=${userInfo.referralCode}`;

  // 🎭 Emoji Avatar Generator
  const emojiList = ["🐱", "🐶", "🐵", "🦊", "🐸", "🐼", "🐯", "🦄", "🐧", "🐙"];
  const emojiIndex =
    parseInt(userInfo?.phone?.slice(-1) || 0) % emojiList.length;
  const avatarEmoji = emojiList[emojiIndex];

  // 📱 Share handler
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on Surath 🎁",
          text: "Use my referral link to sign up and get rewards!",
          url: referralLink,
        });
      } catch (err) {
        console.log("Share cancelled", err);
      }
    } else {
      navigator.clipboard.writeText(referralLink);
      message.success("Referral link copied!");
    }
  };

  return (
    <div className="bg-blue">
      <Box
        sx={{
          minHeight: "100vh",
          p: 2,
          bgcolor: "linear-gradient(160deg, #0a0f1f, #141e30, #243b55)",
          color: "white",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ color: "white" }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ flex: 1, textAlign: "center" }}>
            Profile
          </Typography>
        </Box>

        {/* User Info */}
        <Card
          sx={{
            bgcolor: "#1c1c1c",
            borderRadius: 3,
            color: "white",
            mb: 2,
            boxShadow: 4,
          }}
          className="profile-card"
        >
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: "#ffd700",
                color: "black",
                fontSize: "28px",
              }}
            >
              {avatarEmoji}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {userInfo?.phone || "Player"}
              </Typography>
              <Typography variant="body2" color="gray">
                ID: #{userInfo?._id?.slice(-6) || "XXXXXX"}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* ✅ Referral Section */}
        {console.log("createdBy =>", createdBy)}
        {(!createdBy || createdBy !== 'agent') && (
          <Card
            sx={{
              borderRadius: 4,
              mb: 3,
              textAlign: "center",
              color: "white",
              boxShadow: 6,
              p: 2,
            }}
            className="refer-card"
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              🎁 Invite & Earn
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Scan this QR or share with friends to earn rewards!
            </Typography>

            {/* QR Code */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <QRCodeCanvas
                value={referralLink}
                size={150}
                bgColor="#fff"
                fgColor="#000"
              />
            </Box>

            {/* Buttons */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ShareIcon />}
                onClick={handleShare}
              >
                Share
              </Button>
              <Button
                variant="outlined"
                sx={{ borderColor: "#ffd700", color: "#ffd700" }}
                startIcon={<FileCopyIcon />}
                onClick={() => {
                  navigator.clipboard.writeText(referralLink);
                  message.success("Referral copied!");
                }}
              >
                Copy
              </Button>
            </Box>

            <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
              ⚡ Bonus only for first 10 referrals
            </Typography>
          </Card>
        )}


        {/* 💰 Wallet Section (only) */}
        <Card
          sx={{
            borderRadius: 4,
            p: 2,
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(8px)",
            color: "white",
            marginTop: 0,
          }}
          className="profile-balance-card"
        >
          <Box textAlign="center">
            <WalletIcon
              sx={{ fontSize: 40, color: "#f3e011ff", mb: 1, margin: 0 }}
            />
            <Typography variant="h6" sx={{ mb: 1, fontSize: "16px" }}>
              Total Balance
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                color: "#ffd700",
                textShadow: "0 0 15px #ffd700",
              }}
            >
              ₹{userInfo.balance}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                mt: 2,
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontSize: "16px" }}>
                  Available
                </Typography>
                <Typography variant="h6" color="#4dd0e1">
                  ₹{userInfo.availableBalance}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontSize: "16px" }}>
                  Bonus
                </Typography>
                <Typography variant="h6" color="#81c784">
                  ₹{userInfo.bonusAmount}
                </Typography>
              </Box>
            </Box>
            {/* ⚠️ Note Section */}
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                fontSize: "13px",
                textAlign: "center",
                color: "#ffd700",
                fontStyle: "italic",
              }}
            >
              Bonus balance can be used to play but not for withdrawal.
            </Typography>
          </Box>
        </Card>


      </Box>
    </div>
  );
}

export default Profile;
