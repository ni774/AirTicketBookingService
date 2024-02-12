const { StatusCodes } = require('http-status-codes');
const { Booking } = require('../models/index');
const { AppError, ValidationError } = require('../utils/errors/index');


class BookingRepository {
    async create() {
        try {
            const booking = await Booking.create();
            return booking;
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                throw new ValidationError(error);
            }
            throw new AppError(
                'RepositoryError',
                'cannot create Booking',
                'there was some issue creating the booking, please try again',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
    async update(data){
        try {
            const booking = await Booking.update(data);
            return booking;
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                throw new ValidationError(error);
            }
            throw new AppError(
                'RepositoryError',
                'cannot update Booking',
                'there was some issue updating the booking, please try again',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
}