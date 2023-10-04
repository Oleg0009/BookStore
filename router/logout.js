const express = require('express')
const router = express.Router()



router.get('/', async (req, res) => {
  await req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
    }
    res.redirect('/login');
  });
});


module.exports = router