import RedisHelper from './src/RedisHelper.js';
// const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

const connectRedis = async () => {
	try {
		const REDIS_HOST = '127.0.0.1';
		const REDIS_PORT = 6379;

		// const redisHelper = new RedisHelper();
		// console.log(redisHelper);
		const redisConnection = await RedisHelper.createRedisConnection({ redisHost: REDIS_HOST, redisPort: REDIS_PORT });
		// const setRedisKey = await redisConnection.setRedisKey('deleteKey', 'bar');
		// console.log({ setRedisKey });

		// const setRedisJSONKey = await redisConnection.setRedisJSONKey('deleteJson');
		// console.log({ setRedisJSONKey });

		// const checkKeyExist = await redisConnection.checkKeyExist('json');
		// console.log({ checkKeyExist });

		// const setRedisCollection = await redisConnection.setRedisCollectionObj('users', '1', 'lastName', 'hdhd', true);
		// console.log({ setRedisCollection });

		// const setRedisWithHash = await redisConnection.setRedisKeyWithHash('hash', 'key', { foo: 'bar', test: 'test' });
		// console.log({ setRedisWithHash });

		// const deleteRedisHashedKey = await redisConnection.deleteRedisHashedKey('hash', 'deleteKey');
		// console.log({ deleteRedisHashedKey });

		// const getHashedValues = await redisConnection.getRedisHashedValues('hash', ['deleteKey', 'hashedKey', 'key']);
		// console.log(JSON.stringify({ getHashedValues }, 2, 5));

		// const getHashedValue = await redisConnection.getRedisHashedValue('hash', 'key');
		// console.log(JSON.stringify({ getHashedValue }, 2, 5));

		// const getHashedValue = await redisConnection.getRedisHashedValue('hash', 'key');
		// console.log(JSON.stringify({ getHashedValue }, 2, 5));

		// const deleteRedisJSONKey = await redisConnection.deleteRedisJSONKey('deleteJson');
		// console.log(JSON.stringify({ deleteRedisJSONKey }, 2, 5));

		// const getRedisJSONKey = await redisConnection.getRedisJSONKey('json');
		// console.log(JSON.stringify({ getRedisJSONKey }, 2, 5));

		// const deleteRedisKey = await redisConnection.deleteRedisKey('deleteKey');
		// console.log(JSON.stringify({ deleteRedisKey }, 2, 5));

		// const getRedisKeys = await redisConnection.getRedisKeys('drop*');
		// console.log(JSON.stringify({ getRedisKeys }, 2, 5));

		// const getRedisHashedKeys = await redisConnection.getRedisHashedKeys('hash');
		// console.log(JSON.stringify({ getRedisHashedKeys }, 2, 5));

		// const deleteRedisKeysPattern = await redisConnection.deleteRedisKeysPattern('drop*');
		// console.log(JSON.stringify({ deleteRedisKeysPattern }, 2, 5));
	} catch (err) {
		console.log(JSON.stringify({ err }, 2, 5));
	}
};

connectRedis();
