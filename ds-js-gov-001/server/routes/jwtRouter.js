const express = require('express');
const router = express.Router();
const jwtController = require('../controllers/jwtController');

router.get('/isLoggedIn', jwtController.isLoggedIn);
router.get('/login', jwtController.login);
router.get('/logout', jwtController.logout);

module.exports = router;
