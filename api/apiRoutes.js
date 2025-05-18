const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

const router = express.Router();


//LOGIN ROUTE (LOCAL)
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found");
      return res.redirect('/register');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Incorrect password");
      return res.redirect('/login');
    }

    req.session.username = user.username;
    req.login(user, function (err) {
      if (err) return next(err);
      return res.redirect('/api/order');
    });

  } catch (err) {
    console.error("Login error:", err);
    next(err);
  }
});

//REGISTER ROUTE
router.post('/register', async (req, res, next) => { 

  const { username, password, uemail } = req.body; // uemail comes from form

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.redirect('/login');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      email: uemail           //Save email here
    });

    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.error('Registration error:', err);
    next(err);
  }
});

module.exports = router;