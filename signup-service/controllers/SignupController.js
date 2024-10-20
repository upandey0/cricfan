const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { User } = require('../models');
const secrets = require('../configs/config.json');
const { formatPhoneNumber, createSession, logger } = require('../utils/helper');
const BaseResponse = require('../objects/response/BaseResponse');
const {SUCCESS ,FAILURE} = require("../common/constant");
const {logoutSession} = require("../redis/redis.service");
const INFOBIP_API_KEY =
  'f0381b017497ae810cd93fa0f480d99c-fcd337fd-164f-4430-a580-2fa190da0226';
const INFOBIP_BASE_URL = 'https://qdwg5m.api.infobip.com';
const INFOBIP_SENDER = '447491163443';

class BaseController {
  static handleError(res, error, message = 'An error occurred') {
    console.error(message, error);
    return res.status(500).json({
      success: false,
      message,
      error: error.message || error,
    });
  }
}

// Extend the base controller for specific controllers
class SignupController extends BaseController {
  static async requestOTP(req, res) {
    try {
      let { phone, isEligible } = req.body;
      phone = formatPhoneNumber(phone);

      if (!phone) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is required',
        });
      }

      const existingUser = await User.findOne({ where: { phone } });

      if (!existingUser && !isEligible) {
        return res.status(403).json({
          success: false,
          message: 'User is not eligible to register',
        });
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
      return res.status(200).json(response);
      // return res.status(200).json({
      //   success: true,
      //   message: 'OTP sent successfully',
      //   isNewUser: !existingUser,
      // });
    } catch (error) {
      return SignupController.handleError(res, error, 'Failed to send OTP');
    }
  }

  static async verifyOTP(req, res) {
    try {
      const { otp, phone } = req.body;
      // const { pinId, phone, isNewUser } = req.session || {};

      // if (!pinId || !phone) {
      //     return res.status(400).json({
      //         success: false,
      //         message: 'Invalid session. Please request OTP again'
      //     });
      // }

      // Check if phone number is valid
      if (!phone) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is required',
        });
      }

      // const verificationResponse = await this.verifyOTPWithInfobip(otp, pinId);

      // if (!verificationResponse.data.verified) {
      //     return res.status(400).json({
      //         success: false,
      //         message: 'Invalid OTP'
      //     });
      // }
      const existingUser = await User.findOne({ where: { phone } });
      const isNewUser = !existingUser;

      const user = await SignupController.findOrCreateUser(phone, existingUser);
      const SESSION_ID_TTL = 180*24*60;
      const sessionId = await createSession(user, SESSION_ID_TTL);
      // if (req.session) {
      //   this.clearSession(req.session);
      // }
      const response = new BaseResponse(SUCCESS, {
        sessionId,
        user: {
          id: user.id,
          phone: user.phone,
          isNewUser,
        },
      });

      return res.status(200).json(response);
      // return res.status(200).json({
      //   success: true,
      //   message: 'Authentication successful',
      //   sessionId,
      //   user: {
      //     id: user.id,
      //     phone: user.phone,
      //     isNewUser,
      //   },
      // });
    } catch (error) {
      return SignupController.handleError(res, error, 'Authentication failed');
    }
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
  static async logout(req, res) {
    try {
      const sessionId = String(req.headers['session-id']);
      logger.info("Session Id : ", sessionId);
      const isLoggedOut = await logoutSession(sessionId);
      logger.info("Session logged out : ", isLoggedOut);

      if (isLoggedOut) {
        logger.info("Session logged out successfully for sessionId : ", sessionId);
        res.status(200).send(new BaseResponse(SUCCESS));
      } else {
        logger.error("Failed to logout session for sessionId : ", sessionId);
        res.status(401).send(new BaseResponse(FAILURE));
      }
    } catch (error) {
      logger.error("Error while logging out session : ", error);
      res.status(500).send(error);
    }
  }

  static async findOrCreateUser(phone, existingUser) {
    let user;

    if (!existingUser) {
      user = await User.create({
        phone,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      user = await User.findOne({ where: { phone } });
      user.updatedAt = new Date();
      await user.save();
    }

    return user;
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

  static async resendOTP(req, res) {
    try {
      const { phone } = req.session;

      if (!phone) {
        return res.status(400).json({
          success: false,
          message: 'Invalid session. Please start new authentication',
        });
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

      return res.status(200).json({
        success: true,
        message: 'OTP resent successfully',
      });
    } catch (error) {
      return SignupController.handleError(res, error, 'Failed to resend OTP');
    }
  }

}

module.exports = SignupController;
