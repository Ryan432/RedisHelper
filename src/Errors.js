/* eslint-disable no-use-before-define */
/* eslint-disable max-classes-per-file */
class RedisHelperError extends Error {
	constructor({ message, extraDetails }) {
		super();

		this.message = message;
		this.success = false;
		this.extraDetails = extraDetails;
		this.stackTrace = this.stack;
	}
}

module.exports = { RedisHelperError };
