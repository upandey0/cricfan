class HttpException extends Error {
    constructor(status, errorCode, error, errorObj) {
        super(error);
        
        this.status = status;
        this.errorCode = errorCode;
        this.error = error || null;
        this.errorObj = errorObj || null;
    }
}

module.exports = HttpException;