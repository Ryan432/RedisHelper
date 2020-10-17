import RedisHelper from './src/RedisHelper.js';

const connectRedis = async () => {
	try {
		const REDIS_HOST = '127.0.0.1';
		const REDIS_PORT = 6379;

		// const redisHelper = new RedisHelper();
		// console.log(redisHelper);
		const redisConnection = await RedisHelper.createRedisConnection({ redisHost: REDIS_HOST, redisPort: REDIS_PORT });

		console.log(redisConnection);
	} catch (err) {
		console.log(err);
		console.log(JSON.stringify({ err }, 2, 5));
	}
};

connectRedis();
