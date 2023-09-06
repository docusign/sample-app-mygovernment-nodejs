const express = require('express');
const router = express.Router();
const {
  createController,
  submitLoanController,
} = require('../controllers/loanController');

router.post('/', createController);
router.get('/submitted', submitLoanController);

module.exports = router;
