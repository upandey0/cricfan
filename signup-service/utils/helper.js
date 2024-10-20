const { v4: uuidv4 } = require('uuid');
const { isValidSession, setRedisKey } = require('../redis/redis.service');

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

const logger = {
  info: (message, ...args) => {
    console.log(`INFO: ${message}`, ...args);
  },
  error: (message, ...args) => {
    console.error(`ERROR: ${message}`, ...args);
  }
};

const createSession = async (data, ttl) => {
  const sessionId = "user_" + uuidv4();
  logger.info("UUID : ", sessionId);

  const isKeyDuplicate = await isValidSession(sessionId);

  if (isKeyDuplicate) {
    logger.error("Can't create session as session id already exists. Session id : ", sessionId);
    throw new Error("Duplicate Session key already exists");
  }

  await setRedisKey(sessionId, JSON.stringify(data), ttl);

  logger.info("Session created successfully for session id :" + sessionId + " & user data : ", JSON.parse(JSON.stringify(data)));

  return sessionId;
};

module.exports = {
  formatPhoneNumber,
  createSession,
  logger
};
