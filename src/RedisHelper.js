const aigle = require('aigle');
const _ = require('lodash');
const redis = require('redis');
const rejson = require('redis-rejson');
const Stopwatch = require('timer-stopwatch');
const { RedisHelperError } = require('./Errors');

rejson(redis);

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

	#encryptRedisObjectKey = (objectKeyName) => Buffer.from(String(objectKeyName), 'utf8').toString('hex');
	#decryptRedisObjectKey = (objectKeyName) => Buffer.from(objectKeyName, 'hex').toString('utf8');

	static createRedisConnection = async ({ redisHost, redisPort = 6379 }) => {
		const redisClient = redis.createClient(redisPort, redisHost);
		return new RedisHelper({ redisClient });
	};

	// ---------------- Insert functions ----------------

	setRedisKey = (keyName, value) => {
		return new Promise((resolve, reject) => {
			this.#redisClient.set(keyName, value, (error, result) => {
				if (error) {
					reject(new RedisHelperError({ message: `Failed to set a key, key: ${keyName}, value: ${value}.`, extraDetails: error }));
				} else {
					resolve({ success: true, message: 'Set key successfully.', result });
				}
			});
		});
	};

	setRedisJSONKey = (keyName, array = false) => {
		const jsonValue = array ? '[]' : '{}';
		return new Promise((resolve, reject) => {
			this.#redisClient.json_set(keyName, '.', jsonValue, (err, result) => {
				if (err) {
					reject(new RedisHelperError({ message: `Failed to set a json key, key: ${keyName}`, extraDetails: err }));
				} else {
					resolve({ success: true, message: 'JSON key set successfully.', result });
				}
			});
		});
	};

	setRedisCollectionObj = (collectionName, collectionIdentifier, collectionItemKey, collectionItemValue, createCollectionItemKey = false, encryptKey = false) => {
		createCollectionItemKey = createCollectionItemKey ? 'NX' : 'XX';
		const collectionKeyName = `${collectionName}:${collectionIdentifier}`;
		if (encryptKey) {
			collectionItemKey = this.#encryptRedisObjectKey(collectionItemKey);
		}

		const objectItemKey = `._${collectionItemKey}`;
		const objectItemValue = _.isString(collectionItemValue) ? collectionItemValue : JSON.stringify(collectionItemValue);
		let createNewJsonKey;
		// eslint-disable-next-line no-async-promise-executor
		return new Promise(async (resolve, reject) => {
			try {
				const isKeyExist = await this.checkKeyExist(collectionKeyName);

				if (!isKeyExist) {
					createNewJsonKey = await this.setRedisJSONKey(collectionKeyName);
				}

				// console.log({ objectItemKey });
				this.#redisClient.json_set(collectionKeyName, objectItemKey, objectItemValue, createCollectionItemKey, (err, result) => {
					if (err) {
						// console.log({ err });
						reject(new RedisHelperError({ message: `Failed to set collection object, collectionName: ${collectionName}`, extraDetails: err }));
					} else {
						// console.log({ result });
						resolve({ success: true, keyCreated: createNewJsonKey || 'Key exist', result });
					}
				});
			} catch (err) {
				reject(new RedisHelperError({ extraDetails: err }));
			}
		});
	};

	setRedisKeyWithHash = (hash, keyName, setValue) => {
		const stringedValue = JSON.stringify(setValue);
		return new Promise((resolve, reject) => {
			this.#redisClient.hset(hash, keyName, stringedValue, (err, result) => {
				if (err) {
					reject(new RedisHelperError({ message: `Failed to set a hash key, key: ${keyName}, hash: ${hash}`, extraDetails: err }));
				} else {
					resolve({ success: true, message: 'Key with hash set successfully.', result });
				}
			});
		});
	};

	// ---------------- Search functions ----------------

	getRedisHashedValues = (hash, keysArray) => {
		const parsedValues = [];
		return new Promise((resolve, reject) => {
			const sw = new Stopwatch();
			sw.start();
			this.#redisClient.hmget(hash, keysArray, (err, values) => {
				if (err) {
					reject(new RedisHelperError({ message: `Failed to get hashed values: ${keysArray}, hash: ${hash}`, extraDetails: err }));
				} else {
					_.each(values, (value) => {
						parsedValues.push(JSON.parse(value));
					});
					sw.stop();
					// console.log(JSON.stringify({ sw }, 2, 5));
					resolve({ success: true, data: parsedValues, took: `${sw.ms} mls` });
				}
			});
		});
	};

	getRedisHashedValue = (hash, key) => {
		return new Promise((resolve, reject) => {
			this.#redisClient.hget(hash, key, (err, values) => {
				if (err) {
					reject(new RedisHelperError({ message: `Failed to get hashed key: ${key}, hash: ${hash}`, extraDetails: err }));
				} else {
					resolve({ success: true, data: JSON.parse(values) });
				}
			});
		});
	};

	getRedisJSONKey = (key, jsonPath = '.') => {
		return new Promise((resolve, reject) => {
			this.#redisClient.json_get(key, jsonPath, (err, result) => {
				if (err) {
					reject(new RedisHelperError({ message: `Failed to get key: ${key}`, extraDetails: err }));
				} else {
					resolve({ success: true, data: JSON.parse(result) });
				}
			});
		});
	};

	// ---------------- Utils && Info functions ----------------

	checkKeyExist = (keyName) => {
		return new Promise((resolve, reject) => {
			this.#redisClient.exists(keyName, (err, result) => {
				if (err) {
					reject(new RedisHelperError({ message: 'Something went wrong.', extraDetails: err }));
				} else {
					const keyExist = result === 1;
					resolve(keyExist);
				}
			});
		});
	};

	getRedisKeys = (keysPattern) => {
		return new Promise((resolve, reject) => {
			this.#redisClient.keys(keysPattern, (err, result) => {
				if (err) {
					reject(new RedisHelperError({ message: `Failed to get the keys with pattern: ${keysPattern}`, extraDetails: err }));
				} else {
					resolve({ success: true, data: result, result });
				}
			});
		});
	};

	// Return keys of an hash
	getRedisHashedKeys = (hash) => {
		return new Promise((resolve, reject) => {
			this.#redisClient.hkeys(hash, (err, result) => {
				if (err) {
					reject(new RedisHelperError({ message: `Failed to get keys of hash: ${hash}`, extraDetails: err }));
				} else {
					resolve({ success: true, data: result, result });
				}
			});
		});
	};

	// ---------------- Delete functions ----------------

	deleteRedisKey = (keyName) => {
		return new Promise((resolve, reject) => {
			this.#redisClient.del(keyName, (err, result) => {
				if (err) {
					reject(new RedisHelperError({ message: `Failed to delete the key ${keyName}`, extraDetails: err }));
				} else {
					// console.log({ result });
					switch (result) {
						case 0:
							resolve({ success: true, message: "The key wasn't found in Redis.", result });
							break;
						default:
							resolve({ success: true, message: `${keyName} Deleted successfully.`, result });
							break;
					}
				}
			});
		});
	};

	deleteRedisKeysPattern = (keysPattern) => {
		// eslint-disable-next-line no-async-promise-executor
		return new Promise(async (resolve, reject) => {
			const getKeysWithPattern = await this.getRedisKeys(keysPattern);
			const { data } = getKeysWithPattern;
			if (_.size(data) !== 0) {
				this.#redisClient.del(data, (err, result) => {
					if (err) {
						reject(new RedisHelperError({ message: `Failed to delete keys with pattern: ${keysPattern}`, extraDetails: err }));
					} else {
						resolve({ success: true, message: `${result} keys deleted.`, removedKeys: data, data: result, result });
					}
				});
			} else {
				resolve({ success: true, message: 'Found 0 keys with the pattern supplied.' });
			}
		});
	};

	deleteRedisJSONKey = (key, path = '.') => {
		return new Promise((resolve, reject) => {
			this.#redisClient.json_del(key, path, (err, result) => {
				if (err) {
					reject(new RedisHelperError({ message: `Failed to delete json key: ${key} at path ${path}.`, extraDetails: err }));
				} else {
					resolve({ success: true, message: `${key} deleted successfully.`, result });
				}
			});
		});
	};

	deleteRedisHashedKey = (hash, keyName) => {
		return new Promise((resolve, reject) => {
			this.#redisClient.hdel(hash, keyName, (err, result) => {
				if (err) {
					reject(new RedisHelperError({ message: `Failed to delete a key ${keyName}`, extraDetails: err }));
				} else {
					switch (result) {
						case 0:
							resolve({ success: true, message: `${keyName} Wasn't exist in redis.` }, result);
							break;
						case 1:
							resolve({ success: true, message: `${keyName} Deleted successfully.` }, result);
							break;
						default:
							resolve({ success: true, message: `Unhandled result ${result}` }, result);
							break;
					}
				}
			});
		});
	};

	// ---------------- Query functions ----------------

	insert = (queryObject) => {};
	select = (queryObject) => {};
	update = (queryObject) => {};
	upsert = (queryObject) => {};
}

module.exports = RedisHelper;
// export default RedisHelper;
