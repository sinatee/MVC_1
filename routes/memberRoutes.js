const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

router.get('/members', memberController.getMembers);

module.exports = router;