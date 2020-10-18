import RedisHelper from './src/RedisHelper.js';
const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

const connectRedis = async () => {
	try {
		const REDIS_HOST = '127.0.0.1';
		const REDIS_PORT = 6379;

		// const redisHelper = new RedisHelper();
		// console.log(redisHelper);
		const redisConnection = await RedisHelper.createRedisConnection({ redisHost: REDIS_HOST, redisPort: REDIS_PORT });
		// const setRedisKey = await redisConnection.setRedisKey('key', 'bar');
		// console.log({ setRedisKey });

		// const setRedisJSONKey = await redisConnection.setRedisJSONKey('json');
		// console.log({ setRedisJSONKey });

		// const checkKeyExist = await redisConnection.checkKeyExist('json');
		// console.log({ checkKeyExist });

		// const setRedisCollection = await redisConnection.setRedisCollectionObj('collection', 'books', '!@#!@$@#!', { name: 'first book', lines: 300 }, true);
		// console.log({ setRedisCollection });

		// const setRedisWithHash = await redisConnection.setRedisKeyWithHash('hash', 'key', { foo: 'bar', test: 'test' });
		// console.log({ setRedisWithHash });

		// const deleteRedisHashedKey = await redisConnection.deleteRedisHashedKey('hash', 'deleteKey');
		// console.log({ deleteRedisHashedKey });

		// const getHashedValues = await redisConnection.getRedisHashedValues('hash', ['deleteKey', 'hashedKey', 'key']);
		// console.log(JSON.stringify({ getHashedValues }, 2, 5));
	} catch (err) {
		console.log(JSON.stringify({ err }, 2, 5));
	}
};

connectRedis();
