class BusinessException extends Error {
    constructor(message, code) {
      super(message);
      this.code = code;
    }
  }
  
  try {
    throw new BusinessException('Invalid operation', 400);
  } catch (error) {
    if (error instanceof BusinessException) {
      console.error(`Business error: ${error.message} (code: ${error.code})`);
    } else {
      console.error(`General error: ${error.message}`);
    }
  }
  module.exports = BusinessException;