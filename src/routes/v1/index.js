const express = require('express');

const { bookingController } = require('../../controller/index');

const router = express.Router();

router.post(
  "/bookings",
  bookingController.create
);

module.exports = router;