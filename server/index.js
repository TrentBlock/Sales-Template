const express = require("express");
const db = require("./database/connect");
const googleAuthRouter = require("./routers/googleAuth");
const authJWT = require("./routers/authJWT");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");

require("./database/passportConfig")(passport);
require("dotenv").config();

// express initialization
const app = express();
app.use(session({ secret: "superSecret" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(cookieParser());
app.set("views", path.join(__dirname, "..", "public/views"));
app.set("view engine", "ejs");
db.connect();

app.use("/auth/google", googleAuthRouter);
// Front end routes
app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});
app.get("/about", authJWT, (req, res) => {
  res.render("about", { user: req.user });
});
//  passport.authenticate('jwt', { session: false }),

app.get("/profile", authJWT, (req, res) => {
  res.render("homepage", { user: req.user });
});
app.get("/contact", authJWT, (req, res) => {
  res.render("contact", { user: req.user });
});

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    req.session.destroy();
    res.redirect("/");
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`);
});
