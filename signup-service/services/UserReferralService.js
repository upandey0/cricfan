const { UserReferral } = require('../models'); // Adjust the path as necessary


class UserReferralService {
  static async createUserReferral(referrerUserId, registeredUserId, registeredUserPhoneNumber,referrerUserCode) {
    return await UserReferral.create({
      referrer_user_id: referrerUserId,
      registered_user_id: registeredUserId,
      registered_user_phone_number: registeredUserPhoneNumber,
      referrer_user_code : referrerUserCode
    });
  }

  static async getUserReferralById(referralId) {
    return await UserReferral.findByPk(referralId);
  }

  static async updateUserReferral(referralId, updateData) {
    const referral = await UserReferral.findByPk(referralId);
    if (!referral) {
      throw new Error('User referral not found');
    }
    return await referral.update(updateData);
  }
}

module.exports = UserReferralService;