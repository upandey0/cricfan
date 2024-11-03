const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { User } = require('../models');
const secrets = require('../configs/config.json');
const { formatPhoneNumber, createSession, logger } = require('../utils/helper');
const BaseResponse = require('../objects/response/BaseResponse');
const { SUCCESS, FAILURE } = require("../common/constant");
const { logoutSession } = require("../redis/redis.service");
const UserReferralService = require('../services/UserReferralService');
const { redis } = require('../config');
const ReferralCodeGenerator = require('../utils/referralCodeGenerator');
const HttpException = require('../common/http-exception');
const ReferralCodeService = require('../services/ReferralCodeService');
const UserService = require('../services/UserService');
const ERROR_CODES = require('../common/errorCodes');
const { HttpStatusCode } = require('axios');

const INFOBIP_API_KEY = 'f0381b017497ae810cd93fa0f480d99c-fcd337fd-164f-4430-a580-2fa190da0226';
const INFOBIP_BASE_URL = 'https://qdwg5m.api.infobip.com';
const INFOBIP_SENDER = '447491163443';
const REFERRAL_TTL = 120; // TTL in seconds
const SESSION_ID_TTL = 180 * 24 * 60; // TTL in minutes

class BaseController {
  static handleError(res, error, errorCode) {
    logger.error(errorCode.message, error);
    return res.status(errorCode.code).json({
      success: false,
      message: errorCode.message,
      error: error.message || error,
    });
  }
}

// Extend the base controller for specific controllers
class SignupController extends BaseController {
  // Main Controller Methods
  static async requestOTP(req, res) {
    try {
      let { phone, isEligible, referralCode } = req.body;

      if (!isEligible) {
        return SignupController.handleError(res, new Error(), ERROR_CODES.USER_NOT_ELIGIBLE);
      }

      phone = formatPhoneNumber(phone);

      if (!phone) {
        return SignupController.handleError(res, new Error(), ERROR_CODES.INVALID_PHONE_NUMBER);
      }

      let isReferralCodeValid = false;
      if (referralCode) {
        isReferralCodeValid = await SignupController.isReferralCodeValid(referralCode);
        if (!isReferralCodeValid) {
          throw new HttpException(ERROR_CODES.INVALID_REFERRAL_CODE.code, 'INVALID_REFERRAL_CODE', ERROR_CODES.INVALID_REFERRAL_CODE.message);
        }
      }

      // Save ref_code to REDIS
      if (isReferralCodeValid) {
        SignupController.saveRefCodeInRedis(referralCode, phone);
      }

      // const messageBody = {
      //     messageId: `MSG-${Date.now()}`,
      //     to: phone,
      //     applicationId: "default",
      //     from: INFOBIP_SENDER,
      //     pinLength: 4,
      //     pinType: "NUMERIC"
      // };

      // const response = await axios({
      //     method: 'POST',
      //     url: `${INFOBIP_BASE_URL}/2fa/2/pin`,
      //     headers: {
      //         'Authorization': `App ${INFOBIP_API_KEY}`,
      //         'Content-Type': 'application/json',
      //         'Accept': 'application/json'
      //     },
      //     data: messageBody
      // });

      // req.session = req.session || {};
      // req.session.pinId = response.data.pinId;
      // req.session.phone = phone;
      // req.session.isNewUser = !existingUser;

      const response = new BaseResponse(SUCCESS, {});
      logger.info('OTP request successful for phone:', phone);
      return res.status(HttpStatusCode.Ok).json(response);
    } catch (error) {
      return SignupController.handleError(res, error, ERROR_CODES.FAILED_TO_SEND_OTP);
    }
  }

  static async verifyOTP(req, res) {
    try {
      const { otp, phone } = req.body;
      // const { pinId, phone, isNewUser } = req.session || {};

      // if (!pinId || !phone) {
      //     return SignupController.handleError(res, new Error(), ERROR_CODES.INVALID_SESSION);
      // }

      // Check if phone number is valid
      if (!phone) {
        return SignupController.handleError(res, new Error(), ERROR_CODES.INVALID_PHONE_NUMBER);
      }

      // const verificationResponse = await this.verifyOTPWithInfobip(otp, pinId);

      // if (!verificationResponse.data.verified) {
      //     return SignupController.handleError(res, new Error(), ERROR_CODES.INVALID_OTP);
      // }

      const user = await UserService.findOrCreateUser(phone);
      await SignupController.addReferralMapping(phone);

      const sessionId = await createSession(user, SESSION_ID_TTL);

      // if (req.session) {
      //   this.clearSession(req.session);
      // }
      const response = new BaseResponse(SUCCESS, {
        sessionId,
        user: {
          id: user.id,
          phone: user.phone,
          referralCode: user.referral_code,
        },
      });

      logger.info('OTP verification successful for phone:', phone);
      return res.status(HttpStatusCode.Ok).json(response);
    } catch (error) {
      return SignupController.handleError(res, error, ERROR_CODES.AUTHENTICATION_FAILED);
    }
  }

  static async resendOTP(req, res) {
    try {
      const { phone } = req.session;

      if (!phone) {
        return SignupController.handleError(res, new Error(), ERROR_CODES.INVALID_SESSION);
      }

      const response = await axios({
        method: 'POST',
        url: `${INFOBIP_BASE_URL}/2fa/2/pin`,
        headers: {
          Authorization: `App ${INFOBIP_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        data: {
          applicationId: 'default',
          messageId: `MSG-${Date.now()}`,
          from: INFOBIP_SENDER,
          to: phone,
          pinLength: 6,
          pinType: 'NUMERIC',
          language: 'en',
          senderId: INFOBIP_SENDER,
        },
      });

      req.session.pinId = response.data.pinId;

      logger.info('OTP resent successfully for phone:', phone);
      return res.status(HttpStatusCode.Ok).json({
        success: true,
        message: 'OTP resent successfully',
      });
    } catch (error) {
      return SignupController.handleError(res, error, ERROR_CODES.FAILED_TO_RESEND_OTP);
    }
  }

  static async logout(req, res) {
    try {
      const sessionId = String(req.headers['session-id']);
      logger.info("Session Id: ", sessionId);
      const isLoggedOut = await logoutSession(sessionId);
      logger.info("Session logged out: ", isLoggedOut);

      if (isLoggedOut) {
        logger.info("Session logged out successfully for sessionId: ", sessionId);
        res.status(HttpStatusCode.Ok).send(new BaseResponse(SUCCESS));
      } else {
        logger.error("Failed to logout session for sessionId: ", sessionId);
        res.status(HttpStatusCode.Unauthorized).send(new BaseResponse(FAILURE));
      }
    } catch (error) {
      logger.error("Error while logging out session: ", error);
      res.status(HttpStatusCode.InternalServerError).send(error);
    }
  }

  static async signup(req, res) {
    const { email, password, first_name, last_name } = req.body;

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return SignupController.handleError(res, new Error('Email already in use'), ERROR_CODES.EMAIL_ALREADY_IN_USE);
      }

      const referralCode = ReferralCodeGenerator.generateReferralCodeWithEmail(email);
      const newUser = await User.create({
        email,
        password,
        first_name,
        last_name,
        referral_code: referralCode,
      });

      const sessionId = await createSession(newUser, SESSION_ID_TTL);

      const response = new BaseResponse(SUCCESS, {
        sessionId,
        user: {
          id: newUser.id,
          email: newUser.email,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
        },
      });

      res.status(201).json(response);
    } catch (error) {
      SignupController.handleError(res, error, ERROR_CODES.INTERNAL_SERVER_ERROR);
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return SignupController.handleError(res, new Error('Invalid email or password , no user exist with this email'), ERROR_CODES.INVALID_CREDENTIALS);
      }
      
      const isValid = await user.validPassword(password);
      if (!isValid) {
        return SignupController.handleError(res, new Error('Invalid password'), ERROR_CODES.INVALID_CREDENTIALS);
      }

      const sessionId = await createSession(user, SESSION_ID_TTL);

      const response = new BaseResponse(SUCCESS, {
        sessionId,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      });

      res.status(200).json(response);
    } catch (error) {
      SignupController.handleError(res, error, ERROR_CODES.INTERNAL_SERVER_ERROR);
    }
  }

  // Helper Methods
  static async addReferralMapping(phoneNumber) {
    const referralKey = `REFERRAL_${phoneNumber}`;
    const referralCode = await redis.get(referralKey);

    if (!referralCode) return;

    const referrerUser = await UserService.getUserByReferralCode(referralCode);
    const registeredUser = await UserService.getUserByPhone(phoneNumber);

    if (referrerUser && registeredUser) {
      await UserReferralService.createUserReferral({
        referrerUserId: referrerUser.id,
        registeredUserId: registeredUser.id,
        registeredUserPhoneNumber: phoneNumber,
        referrerUserCode: referralCode,
      });
    }
  }

  static async isReferralCodeValid(referralCode) {
    try {
      const referralCodeRecord = await ReferralCodeService.getReferralCode(referralCode);

      if (!referralCodeRecord) {
        logger.info("Referral code not found");
        return false;
      }
      logger.info("Referral code record: ", referralCodeRecord);

      if (referralCodeRecord.reached_limit) {
        logger.info("Referral code has reached its limit");
        return false;
      }
      logger.info("Incrementing times_used field");

      await ReferralCodeService.updateReferralCodeUsage(referralCode);

      return true;
    } catch (error) {
      logger.error("Error while validating referral code: ", error);
      return false;
    }
  }

  static async saveRefCodeInRedis(referralCode, phoneNumber) {
    if (!referralCode || !phoneNumber) {
      throw new Error('Referral code and phone number are required');
    }
    const key = `REFERRAL_${phoneNumber}`;

    return new Promise((resolve, reject) => {
      redis.setex(key, REFERRAL_TTL, referralCode, (err, reply) => {
        if (err) {
          logger.error("Error saving referral code in Redis: ", err);
          return reject(err);
        }
        logger.info(`Referral code saved in Redis with key ${key}`);
        resolve(reply);
      });
    });
  }

  static async verifyOTPWithInfobip(otp, pinId) {
    return axios({
      method: 'post',
      url: `${INFOBIP_BASE_URL}/2fa/2/pin/verify`,
      headers: {
        Authorization: `App ${INFOBIP_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: {
        pin: otp,
        pinId: pinId,
      },
    });
  }

  static generateJWT(user) {
    return jwt.sign(
      { userId: user.id, phone: user.phone },
      secrets.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  static clearSession(session) {
    delete session.pinId;
    delete session.phone;
    delete session.isNewUser;
  }
}

module.exports = SignupController;