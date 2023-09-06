const express = require('express');
const router = express.Router();
const passportController = require('../controllers/passportController');

router.post('/', passportController.createController);

module.exports = router;
