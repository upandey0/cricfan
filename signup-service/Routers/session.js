const express = require("express");
const { HttpStatusCode } = require("axios");
const {logger} = require("../utils/helper");
const {isValidSession,getIdFromSession} = require("../redis/redis.service");
const {HEADER_SESSION_ID, SUCCESS, FAILURE} = require("../common/constant");
const BaseResponse = require("../objects/response/BaseResponse");
const sessionRouter = express.Router();

sessionRouter.get("/validate", async (req, res) => {
    try {
        logger.info("Session Id : ", req.headers[HEADER_SESSION_ID]);
        let isValid = await isValidSession(String(req.headers[HEADER_SESSION_ID]));

        if (isValid) {
            let userId = await getIdFromSession(String(req.headers[HEADER_SESSION_ID]));
            console.log("User Id : ", userId);
            res.status(HttpStatusCode.Ok).send(new BaseResponse(SUCCESS, data = {userId}));
        } else {
            res.status(HttpStatusCode.Unauthorized).send(new BaseResponse(FAILURE));
        }
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = sessionRouter;