import aigle from 'aigle';
import _ from 'lodash';
import redis from 'redis';
import rejson from 'redis-rejson';
rejson(redis);
// import { ValidationError } from './Errors.js';

class RedisHelper {
	#redisClient;
	#redisConnectionAttempts = [];
	#redisReconnectionInterval;
	constructor({ redisClient }) {
		// console.log({ redisClient });
		this.#redisClient = redisClient;

		this.#redisClient.on('connect', () => {
			console.log('Redis connected successfully.');
		});

		this.#redisClient.on('ready', () => {
			// console.log(colors.bold.brightRed(`Redis on ready state.`));
		});

		this.#redisClient.on('error', (err) => {
			console.log(err);
		});

		this.#redisClient.on('reconnecting', (retry) => {
			this.#redisConnectionAttempts.push(retry.attempt);
			this.#redisReconnectionInterval = retry.delay;
			const errorCode = _.get(retry.error, 'code');
			console.log();
			console.log('-------------------------------------------------------------------');
			console.log(`Redis lost connection, error code: '${errorCode}'`);
			console.log(`Retries attempts [${_.size(this.#redisConnectionAttempts)}], Trying to connect again in ${this.#redisReconnectionInterval / 1000} seconds.`);
			console.log('-------------------------------------------------------------------');
			console.log();
		});
	}

	static createRedisConnection = async ({ redisHost, redisPort }) => {
		const redisClient = redis.createClient(redisPort, redisHost);

		// this.redisClient.on('connect', () => {
		// 	console.log('Redis connected successfully.');
		// });

		// this.redisClient.on('ready', () => {
		// 	// console.log(colors.bold.brightRed(`Redis on ready state.`));
		// });

		// this.redisClient.on('error', (err) => {
		// 	console.log(err);
		// });

		// this.redisClient.on('reconnecting', (retry) => {
		// 	this.#redisConnectionAttempts.push(retry.attempt);
		// 	this.#redisReconnectionInterval = retry.delay;
		// 	const errorCode = _.get(retry.error, 'code');
		// 	console.log();
		// 	console.log('-------------------------------------------------------------------');
		// 	console.log(`Redis [Client] lost connection, error code: '${errorCode}'`);
		// 	console.log(`Retries attempts [${_.size(this.#redisConnectionAttempts)}], Trying to connect again in ${this.#redisReconnectionInterval / 1000} seconds.`);
		// 	console.log('-------------------------------------------------------------------');
		// 	console.log();
		// });
		return new RedisHelper({ redisClient });
	};
}

export default RedisHelper;
