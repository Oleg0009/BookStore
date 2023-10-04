const express = require('express')
const router = express.Router()
const passport = require('../services/passport')
const User = require('../models/user')



router.get('/', isAuthenticated, (req, res) => {
  res.redirect('/books');
});

router.get('/new', (req, res) => {
  res.render('auth/registrate');
});


router.post('/', 
  passport.authenticate('local', {
    successRedirect: '/authors',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

router.post('/new', async (req, res, next) => {
  const { username, password, email } = req.body;
  try {
    const newUser = new User({
      username: username,
      password: password, 
      email: email, 
    });

    await newUser.save();
    passport.authenticate('local', (err, user, info) => {
      if (user) {
        req.logIn(user, function (err) {
          if (err) {
            return next(err);
          }
          return res.redirect('/books');
        });
      } else {
        return res.render('auth/login', { error: 'Registration succeeded, but login failed.' });
      }
    })(req, res, next);
  } catch (error) {
    res.render('auth/registrate', { error: 'Registration failed. Please try again.' });
  }
});


function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); 
  }
  res.render('auth/login',{ error:req.flash('error')[0]}); 
}


module.exports = router