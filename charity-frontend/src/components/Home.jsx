import React from "react";
import Navbar from "./Navbar";
import { Box, Typography, Button, Grid, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import { Link } from "react-router-dom";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import PaidIcon from "@mui/icons-material/Paid";

const backgroundImage =
  "https://static.vecteezy.com/system/resources/previews/043/197/284/non_2x/logo-illustration-of-hands-holding-a-heart-representing-charity-and-support-vector.jpg";

const HeroSection = styled(Box)(() => ({
  height: "110vh",
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  textAlign: "center",
  position: "relative",
}));

const Overlay = styled(Box)(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
}));

const FeatureSection = styled(Box)(() => ({
  padding: "5rem 2rem",
  backgroundColor: "#f4f4f4",
  textAlign: "center",
  marginTop: "-5rem",
  zIndex: 5,
  position: "relative",
  borderTop: "5px solid #FF5733",
  borderRadius: "15px",
  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
}));

const CTAButton = styled(Button)(() => ({
  backgroundColor: "#FF5733",
  color: "white",
  padding: "1rem 3rem",
  fontSize: "1.5rem",
  fontWeight: "bold",
  marginTop: "2rem",
  borderRadius: "30px",
  "&:hover": {
    backgroundColor: "#c0392b",
    transform: "scale(1.05)",
    transition: "transform 0.3s ease-in-out",
  },
}));

const FeatureCard = styled(Box)(() => ({
  padding: "2rem",
  backgroundColor: "#fff",
  borderRadius: "15px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
  },
}));

const Home = () => {
  return (
    <Box>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection>
        <Overlay />
        <Box sx={{ zIndex: 10, position: "relative" }}>
          <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
            Panchayat Specific Charity Fund Collection Through Entertainment
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Play Games, Make an Impact
          </Typography>
          <CTAButton component={Link} to="/login">
            Start Playing
          </CTAButton>
        </Box>
        <IconButton
          sx={{ position: "absolute", bottom: 30, color: "white", zIndex: 10 }}
          href="#features"
        >
          <ArrowDownwardIcon fontSize="large" />
        </IconButton>
      </HeroSection>

      {/* Feature Section */}
      <FeatureSection id="features">
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
          How It Works
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {[
            {
              title: "Join Games",
              icon: <PlayCircleOutlineIcon />,
              description: "Play various fun and competitive games.",
            },
            {
              title: "Donate Easily",
              icon: <VolunteerActivismIcon />,
              description:
                "A portion of your game entry goes directly to charity.",
            },
            {
              title: "Win Rewards",
              icon: <PaidIcon />,
              description: "Get exciting rewards while making a difference!",
            },
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <FeatureCard>
                {feature.icon}
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" sx={{ color: "#7f8c8d" }}>
                  {feature.description}
                </Typography>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </FeatureSection>
    </Box>
  );
};

export default Home;
