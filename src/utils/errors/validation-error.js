const { StatusCodes } = require('http-status-codes');

class ValidationError extends Error {
    constructor(error)
    {
        super(error);
        let explanation = [];
        error.errors.forEach((err) => {   // sequelize return error in this form
            explanation.push(err.message);
        });
    
        this.name = 'ValidationError';
        this.message = 'Not able to validate the data sent in the request';
        this.explanation = explanation;
        this.statusCodes = statusCodes;
    }
}

module.exports = ValidationError;