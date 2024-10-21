const { UserReferralCode } = require('../models'); // Adjust the path as necessary

class ReferralCodeService {
  static async saveReferralCode(referralCode, timesUsed = 0, reachedLimit = false) {
    try {
      const newReferralCode = await UserReferralCode.create({
        ref_code: referralCode,
        times_used: timesUsed,
        reached_limit: reachedLimit,
      });

      console.log('Referral code saved successfully:', newReferralCode);
      return newReferralCode;
    } catch (error) {
      console.error('Error saving referral code:', error.message);
      throw new Error('Failed to save referral code');
    }
  }

  static async getReferralCode(referralCode) {
    try {
      const referralCodeRecord = await UserReferralCode.findOne({
        where: { ref_code: referralCode }
      });

      if (!referralCodeRecord) {
        throw new Error('Referral code not found');
      }

      return referralCodeRecord;
    } catch (error) {
      console.error('Error fetching referral code:', error.message);
      throw new Error('Failed to fetch referral code');
    }
  }

  static async updateReferralCodeUsage(referralCode) {
    try {
      const referralCodeRecord = await this.getReferralCode(referralCode);

      referralCodeRecord.times_used += 1;
      await referralCodeRecord.save();

      console.log('Referral code usage updated successfully:', referralCodeRecord);
      return referralCodeRecord;
    } catch (error) {
      console.error('Error updating referral code usage:', error.message);
      throw new Error('Failed to update referral code usage');
    }
  }
}

module.exports = ReferralCodeService;