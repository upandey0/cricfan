class ApiResponse {

    successResponse(status_code, message){
        this.status_code = status_code
        return {
            success: true,
            message : message
        }
    }

    InternalServerError(status_code,error){
        this.status_code = status_code
        return {
            success: false,
            message : error.message
        }
    }

    ExternalApiError(status_code,error){
        this.status_code = status_code
        return {
            success: false,
            message : error.message
        }
    }

}