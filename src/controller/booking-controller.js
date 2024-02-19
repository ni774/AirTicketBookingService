const { StatusCodes } = require('http-status-codes');
const { BookingService } = require('../service/index');

const bookingService = new BookingService();

const create = async ( req, res )=> {
    try {
        const response = await bookingService.createBooking(req.body);
        
       // console.log("response from booking controller: "+ response); //will give [object][object] because of coarcion
        // console.log("response from booking controller: ",response); //will directly concatinate
        
        return res.status(StatusCodes.OK).json({
            message: 'Successfully completed booking',
            success: true,
            err: {},
            data: response
        })
    } catch (error) {
        console.log("error from booking controller: ",error);
        return res.status(error.statusCode).json({
            message: error.message,
            success: false,
            err: error.explanation,
            data: {}
        });
    }

}

const update = async (req,res) => {
    try {
        console.log(req.params.id);
        const response = await bookingService.updateBooking(req.params.id);
        return res.status(StatusCodes.OK).json({
            message: 'Successfully updated booking',
            success: true,
            err: {},
            data: response
        })
    } catch (error) {
        console.log("error from booking controller: ",error);
        return res.status(error.statusCode).json({
            message: error.message,
            success: false,
            err: error.explanation,
            data: {}
        });
    }
}

module.exports = {
    create,
    update,
}