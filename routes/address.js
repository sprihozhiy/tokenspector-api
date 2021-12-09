const express = require('express');
const router = express.Router();
const getAddressData = require('../controllers/addressData');

router.get('/:address', getAddressData);


module.exports = router;