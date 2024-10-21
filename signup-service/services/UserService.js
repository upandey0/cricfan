const { User } = require('../models'); // Adjust the path as necessary
const ReferralCodeGenerator = require('../utils/referralCodeGenerator');
const ReferralCodeService = require('./ReferralCodeService');

class UserService {
  static async findOrCreateUser(phone) {
    let user = await User.findOne({ where: { phone } });
    if (!user) {
      const referral_code = ReferralCodeGenerator.generateReferralCode(phone);
      user = await User.create({ phone,referral_code,createdAt: new Date(),updatedAt: new Date() });
      await ReferralCodeService.saveReferralCode(user.referral_code);
    }
    return user;
  }

  static async getUserById(userId) {
    return await User.findByPk(userId);
  }

  static async updateUser(userId, updateData) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return await user.update(updateData);
  }

  static async getUserByReferral(referralCode) {
    const user = await User.findOne({ where: { referral_code: referralCode } });
    if (!user) {
      throw new Error('User not found with the given referral code');
    }
    return user;
  }
}

module.exports = UserService;