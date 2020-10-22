// import RedisHelper from './src/RedisHelper.js';
const RedisHelper = require('./src/RedisHelper');
// const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration));
const _ = require('lodash');
class Test {
	name = 'test';

	function = () => {
		console.log('test');
	};
}

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
		// const setRedisCollection = await redisConnection.setRedisCollectionObj('services', 'externalApis', 'objectClass', object, true);
		// console.log({ setRedisCollection });

		// const classTest = new Error();
		// classTest.function = () => {
		// 	return 'function';
		// };
		// const object = { class: new Test() };
		// console.log(object);
		const classObj = new Test();
		console.log(JSON.stringify({ test: classObjצא }));
		const setRedisWithHash = await redisConnection.setRedisKeyWithHash('externalApis', 'MTB', classObj.toString('hex'));
		console.log({ setRedisWithHash });

		// const deleteRedisHashedKey = await redisConnection.deleteRedisHashedKey('hash', 'deleteKey');
		// console.log({ deleteRedisHashedKey });

		const getHashedValues = await redisConnection.getRedisHashedValues('externalApis', ['MTB']);
		const { data } = getHashedValues;
		console.log(data);
		console.log(JSON.parse(data[0]));

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
		console.log(err);
		console.log(JSON.stringify({ err }, 2, 5));
	}
};

connectRedis();
