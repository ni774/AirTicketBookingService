const { StatusCodes } = require('http-status-codes');
const { BookingService } = require('../service/index');

const { createChannel, publishMessage } = require('../utils/messageQueue');
const { REMINDER_BINDING_KEY } = require('../config/serverConfig');
const bookingService = new BookingService();

class BookingController {
    constructor(channel) {
        this.channel = channel;
    }

    async sendMessageToQueue(req,res) {
        const channel = await createChannel();
        const payload = {
            data:{
                subject: "ticket3 from queue",
                content: "Hii, i am Ai assistent for your help",
                recepientEmail: "angelbroker89@gmail.com",
                notificationTime: '2023-01-01T00:00:00'
            },
            
            service: 'CREATE_TICKET'
        };
        
        publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));
        return res.status(200).json({
            message: 'Successfully sent message to queue',
            success: true,
            err: {},
            data: payload
        })
    }

    async create (req, res) {
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

    async update (req, res) {
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
}

// const create = async ( req, res )=> {
//     try {
//         const response = await bookingService.createBooking(req.body);
        
//        // console.log("response from booking controller: "+ response); //will give [object][object] because of coarcion
//         // console.log("response from booking controller: ",response); //will directly concatinate
        
//         return res.status(StatusCodes.OK).json({
//             message: 'Successfully completed booking',
//             success: true,
//             err: {},
//             data: response
//         })
//     } catch (error) {
//         console.log("error from booking controller: ",error);
//         return res.status(error.statusCode).json({
//             message: error.message,
//             success: false,
//             err: error.explanation,
//             data: {}
//         });
//     }

// }

// const update = async (req,res) => {
//     try {
//         console.log(req.params.id);
//         const response = await bookingService.updateBooking(req.params.id);
//         return res.status(StatusCodes.OK).json({
//             message: 'Successfully updated booking',
//             success: true,
//             err: {},
//             data: response
//         })
//     } catch (error) {
//         console.log("error from booking controller: ",error);
//         return res.status(error.statusCode).json({
//             message: error.message,
//             success: false,
//             err: error.explanation,
//             data: {}
//         });
//     }
// }

module.exports = BookingController