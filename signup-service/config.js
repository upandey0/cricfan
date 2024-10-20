const dotenv = require('dotenv');
const Redis = require('ioredis');

dotenv.config();

const redis = new Redis({
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    host: process.env.REDIS_HOST

});
module.exports = {redis}
