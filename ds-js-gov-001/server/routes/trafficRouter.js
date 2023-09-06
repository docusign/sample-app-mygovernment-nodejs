const express = require('express');
const router = express.Router();
const {
  createController,
  smsTrafficController,
  submitTrafficController,
} = require('../controllers/trafficController');

router.post('/', createController);
router.post('/sms', smsTrafficController);
router.get('/submitted', submitTrafficController);

module.exports = router;
