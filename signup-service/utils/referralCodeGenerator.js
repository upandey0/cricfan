const BusinessException = require('../common/BusinessException');
class ReferralCodeGenerator {
    static MIN_NUMBER = 1000000000;
    static MAX_NUMBER = 9999999999;
    static BASE_VALUE = 36;
  
    constructor() {
      throw new Error('ReferralCodeGenerator class object cannot be created');
    }
  
    static generateReferralCode(phoneNumber) {
      if (!this.isValidPhoneNumber(phoneNumber)) {
        throw new BusinessException(`Invalid phone number ${phoneNumber} for generating referral code`, 1);
      }

      const phone = parseInt(phoneNumber, 10);
      return this.convertToBase36(phone);
    }
  
    static isValidPhoneNumber(phoneNumber) {
      const phone = parseInt(phoneNumber, 10);
      return phoneNumber && this.MIN_NUMBER <= phone && phone <= this.MAX_NUMBER;
    }
  
    static convertToBase36(number) {
      let referCode = '';
      let numberCopy = number;
  
      while (numberCopy > 0) {
        const remainder = numberCopy % this.BASE_VALUE;
        if (remainder < 10) {
          referCode = remainder + referCode;
        } else {
          referCode = String.fromCharCode(remainder + 55) + referCode;
        }
        numberCopy = Math.floor(numberCopy / this.BASE_VALUE);
      }
  
      return referCode;
    }
  
  }
  
  module.exports = ReferralCodeGenerator;