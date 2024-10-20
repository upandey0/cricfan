const {redis} = require('../config');

const isValidSession = async (sessionId) => {
    let isValid = await redis.exists(sessionId);
    return isValid ? true : false;
};

const setRedisKey = async (sessionId, data, ttl) => {
    console.info("Value of Key sessionId : ", JSON.stringify(data));
    let isDataSaved = await redis.set(sessionId, JSON.stringify(data), 'EX', ttl);
    if (isDataSaved) {
        console.info("Session is created for sessionId", sessionId);
    } else {
        console.info("Session is not created for sessionId", sessionId);
    }
};

const getIdFromSession = async (sessionId) => {
    let result = await redis.get(sessionId);
    if (!result) {
        throw Error(`${sessionId} key is not present in Redis`);
    }
    let data;
    try {
        data = JSON.parse(result);
        data = JSON.parse(data);
        console.info("Result from Redis get call:", data.id);
        return data.id;
    } catch (error) {
        throw new Error(`Failed to parse JSON for sessionId ${sessionId}: ${error.message}`);
    }
    
};

const logoutSession = async (sessionId) => {
    try {
        let result = await redis.del(sessionId);
        return result === 1;
    } catch (error) {
        console.error("Error while logging out:", error);
        return false;
    }
};

module.exports = {
    isValidSession,
    setRedisKey,
    getIdFromSession,
    logoutSession
};


