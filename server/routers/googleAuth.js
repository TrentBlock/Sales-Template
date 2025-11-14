const express = require("express");
const passport = require("passport");
const googleAuthRouter = express.Router();
const jwt = require("jsonwebtoken");

// Simple router for /auth/google
googleAuthRouter.get(
  "/",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// Redirected to after login
googleAuthRouter.get(
  "/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user.google;
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    // Generate JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send token as response
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    res.redirect("http://localhost:3000/profile");
  }
);

module.exports = googleAuthRouter;
