const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { User } = require('../models');
const secrets = require('../configs/config.json');

const INFOBIP_API_KEY = 'f0381b017497ae810cd93fa0f480d99c-fcd337fd-164f-4430-a580-2fa190da0226';
const INFOBIP_BASE_URL = 'https://qdwg5m.api.infobip.com';
const INFOBIP_SENDER = '447491163443';

// Helper function to format phone number
const formatPhoneNumber = (phone) => {
  // Remove any non-digit characters
  const cleanPhone = phone.toString().replace(/\D/g, '');
  
  // Add country code (91 for India) if not present
  if (cleanPhone.length === 10) {
    return `+91${cleanPhone}`;
  } else if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
    return `+${cleanPhone}`;
  }
  return cleanPhone;
};

const requestOTPController = async (req, res) => {
    try {
        let { phone, isEligible } = req.body;
        
        // Format phone number
        phone = formatPhoneNumber(phone);

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required'
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ where: { phone } });

        // If user doesn't exist and isEligible is false, return error
        if (!existingUser && !isEligible) {
            return res.status(403).json({
                success: false,
                message: 'User is not eligible to register'
            });
        }

        // Prepare the request body for Infobip
        const messageBody = {
            messageId: `MSG-${Date.now()}`,  // Required unique message ID
            to: phone,                       // Required destination number
            applicationId: "default",    // Required application identifier
            from: INFOBIP_SENDER,            // Your sender ID
            pinLength: 4,
            pinType: "NUMERIC"
        };

        console.log('Sending request to Infobip:', messageBody); // For debugging

        // Send OTP via Infobip
        const response = await axios({
            method: 'POST',
            url: `${INFOBIP_BASE_URL}/2fa/2/pin`,
            headers: {
                'Authorization': `App ${INFOBIP_API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: messageBody
        });

        console.log('Infobip response:', response.data); // For debugging

        // Store pinId in session or temporary storage
        req.session = req.session || {};
        req.session.pinId = response.data.pinId;
        req.session.phone = phone;
        req.session.isNewUser = !existingUser;

        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            isNewUser: !existingUser
        });

    } catch (error) {
        console.error('Error details:', error.response?.data || error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send OTP',
            error: error.response?.data || error.message
        });
    }
};
const verifyOTPController = async (req, res) => {
    try {
        const { otp } = req.body;
        const { pinId, phone, isNewUser } = req.session || {};

        if (!pinId || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Invalid session. Please request OTP again'
            });
        }

        // Verify OTP with Infobip
        const verificationResponse = await axios({
            method: 'post',
            url: `${INFOBIP_BASE_URL}/2fa/2/pin/verify`,
            headers: {
                'Authorization': `App ${INFOBIP_API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: {
                pin: otp,
                pinId: pinId
            }
        });

        if (!verificationResponse.data.verified) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        let user;

        if (isNewUser) {
            // Create new user
            user = await User.create({
                phone,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        } else {
            // Update existing user
            user = await User.findOne({ where: { phone } });
            user.updatedAt = new Date();
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, phone: user.phone },
            secrets.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Clear session data
        if (req.session) {
            delete req.session.pinId;
            delete req.session.phone;
            delete req.session.isNewUser;
        }

        return res.status(200).json({
            success: true,
            message: 'Authentication successful',
            token,
            user: {
                id: user.id,
                phone: user.phone,
                isNewUser
            }
        });

    } catch (error) {
        console.error('Error in verifyOTPController:', error.response?.data || error);
        return res.status(500).json({
            success: false,
            message: 'Authentication failed',
            error: error.response?.data || error.message
        });
    }
};


// Optional: Resend OTP Controller
const resendOTPController = async (req, res) => {
    try {
        const { phone } = req.session;

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: 'Invalid session. Please start new authentication'
            });
        }

        // Send new OTP via Infobip
        const response = await infobipClient.post('/2fa/2/pin', {
            applicationId: 'default',
            messageId: `MSG-${Date.now()}`,
            from: INFOBIP_SENDER,
            to: phone,
            pinLength: 6,
            pinType: 'NUMERIC',
            language: 'en',
            senderId: INFOBIP_SENDER
        });

        // Update session with new pinId
        req.session.pinId = response.data.pinId;

        return res.status(200).json({
            success: true,
            message: 'OTP resent successfully'
        });

    } catch (error) {
        console.error('Error in resendOTPController:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to resend OTP'
        });
    }
};

module.exports = {
    requestOTPController,
    verifyOTPController,
    resendOTPController
};