/**
 * This is the main configuration file for the whole project. This will contain all the configuration of the project like
 * JWT and Passport config, MongoDB config and other info. I plan to make a spearate config file for each (mongo, passport etc.)
 * and export all using this index file (--> Later if needed)
 */
const {promisify} = require('util');
const mongoose = require("mongoose");
const redis = require("redis");

const redisClient = redis.createClient(process.env.REDIS_URL || "http://127.0.0.1:6379");

redisClient.on("connect", function(){
    console.log("Redis Client is connnected");
});

redisClient.on("error", function(redisError){
    console.log(`Error occurred while connecting Redis: ${redisError}`);
});


const hsetAsync = promisify(redisClient.hset).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);


/**
 * Use the default node.js promise library
 */
mongoose.Promise = global.Promise;

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI || 'mongodb://localhost:27017/elib', { useNewUrlParser: true });

module.exports = {mongoose, redisClient}