const axios = require('axios');

const { BookingRepository } = require("../repository/index");
const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');
const {ServiceError } = require('../utils/errors');

class BookingService {
    constructor(){
        this.bookingRepository = new BookingRepository();
    }

    async createBooking(data) {
        console.log(data);
        try {
            const flightId = data.flightId;

            // get data from flightsAndSearch service
            let getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const response = await axios.get(getFlightRequestURL);
            const flightData = response.data.data;
            console.log("flightData",flightData);
            let priceOfTheFlight = flightData.price;
            if(data.noOfSeats > flightData.totalSeats) {
                throw new ServiceError("something went wrong in booking process", "insufficiant seats in the flight");
            }
            const totalCost = priceOfTheFlight * data.noOfSeats;
            const bookingPayload = {...data, totalCost};
            console.log("bookingPayload",bookingPayload);
            const booking = await this.bookingRepository.create(bookingPayload);
            // console.log("booking",booking);

            //* after successfully booking update the noOfSeats from flights
            let updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const updateResponse = await axios.patch(updateFlightRequestURL, {
                totalSeats: flightData.totalSeats - booking.noOfSeats
            });
            // console.log("updated", updateResponse.data);

            //* now update status
            const finalBooking = await this.bookingRepository.update(booking.id, {status: "Booked"});
            return finalBooking;
            
        } catch (error) {
            // console.log("something went wrong in the service layer", error);
            if (
              error.name === "RepositoryError" ||
              error.name === "ValidationError"
            ){
                throw error;
            }
            else
                throw new ServiceError();
        }

    }

    async updateBooking(bookingId){
        try {
            const updatedBookingDetail = await this.bookingRepository.update(bookingId, {status: 'Canceled'}); //get noOfSeats
            console.log("updatebooking",updatedBookingDetail);

            //aftern cancel update noOfSeats in flight
            let updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${updatedBookingDetail.flightId}`;
            const updateResponse = await axios.patch(updateFlightRequestURL, {
                noOfSeats: updatedBookingDetail.noOfSeats,
                type: 'cancel'
            });
            // console.log("updatedResponse", updateResponse.data);

            return true;

        } catch (error) {
            if (
                error.name === "RepositoryError" ||
                error.name === "ValidationError"
            ){
                throw error;
            }
            else
                throw new ServiceError();
        }
    }
}

module.exports = BookingService;