const axios = require('axios');

const { BookingRepository } = require('../repository/index');
const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');
const {ServiceError } = require('../utils/errors');

class BookingService {
    constructor(){
        // this.BookingRepository = new BookingRepository();
    }

    async createBooking(data) {
        try {
            const flightId = data.flightId;
            console.log(flightId);
            let getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const flight = await axios.getAdapter(getFlightRequestURL);
            console.log("flight",flight);
        } catch (error) {
            // console.log("something went wrong in the repository", error);
            throw new ServiceError();
        }

    }
}

module.exports = BookingService;