const express = require('express')
const router = express.Router()
const passport = require('./passport')
const User = require('../models/user')



router.get('/', isAuthenticated, (req, res) => {

  res.redirect('/books'); // Render the login form template
});


router.post('/', 
  passport.authenticate('local', {
    successRedirect: '/authors',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

function isAuthenticated(req, res, next) {
  // res.send('auth')
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, allow access
  }
  // User is not authenticated, handle as needed (e.g., redirect to login)

  res.render('auth/login',{ error:req.flash('error')[0]}); // Redirect to the login page
}


module.exports = router