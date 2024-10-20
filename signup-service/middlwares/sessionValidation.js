const { HttpStatusCode } = require("axios");
const express = require("express");
const { HEADER_SESSION_ID } = require("../common/constant");
const { isValidSession } = require("../redis/redis.service");
const {logger} = require("../utils/helper");
const HttpException = require("../common/http-exception");


const validateSessionInReq = async (req, res, next) => {
    logger.info("validateSessionInReq middleware called for requestId : ", req.headers[HEADER_SESSION_ID]);

    let isValid = await isValidSession(String(req.headers[HEADER_SESSION_ID]));

    if (isValid) {
        // After Session validation adding same session-id in the response headers.
        logger.info("Session is valid for sessionId : ", req.headers[HEADER_SESSION_ID]);
        res.setHeader(HEADER_SESSION_ID, String(req.headers[HEADER_SESSION_ID]));
        next();
    } else {
        let e = new Error("UnAuthorised");
        // TODO : change 1001 with proper error code.
        res.status(HttpStatusCode.Unauthorized).send(new HttpException(HttpStatusCode.Unauthorized, 1001, e.message));
    }
};

module.exports = { validateSessionInReq };