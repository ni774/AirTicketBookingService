const express = require('express');

const { BookingController } = require('../../controller/index');
// const {createChannel } = require('../../utils/messageQueue');

// const channel = await createChannel();
const bookingController = new BookingController();
const router = express.Router();

router.post(
  "/bookings",
  bookingController.create
);

router.post('/publish', bookingController.sendMessageToQueue); 

router.patch(
  "/update/:id",
  bookingController.update
)

module.exports = router;