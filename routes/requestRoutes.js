const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController')

router.get('/requests', requestController.getRequests);

router.post('/requests/create', requestController.createRequest);
router.post('/requests/vote', requestController.voteRequest);
router.post('/requests/cancel', requestController.cancelRequest);

module.exports = router;