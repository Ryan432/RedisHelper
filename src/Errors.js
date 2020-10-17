/* eslint-disable no-use-before-define */
/* eslint-disable max-classes-per-file */
class ValidationError extends Error {
	constructor({ message, extraDetails }) {
		super();

		this.message = message;
		this.extraDetails = extraDetails;
		this.stackTrace = this.stack;
	}
}

export { ValidationError };
