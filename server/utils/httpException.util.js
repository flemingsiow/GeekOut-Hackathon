/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


/** @class ExtendableError representing a known error */
class ExtendableError extends Error {
    /**
     * creates an instance of an error
     * 
     * @constructor
     * @param {string} message contains the error message
     */
    constructor(message) {

        // check if the parent class "ExtendableError" was being instantiated
        if (new.target === ExtendableError) {
            throw new TypeError('Abstract class "ExtendableError" cannot be instantiated directly.');
        };

        super(message); // call parent "Error" constructor method
        this.name = this.constructor.name;
        this.message = message;
        this.stack = this.constructor.stack;

        // creates stack property to allow trace
        Error.captureStackTrace(this, this.contructor);
    };
};




/** @class BadRequest representing a 400 Bad Request Error */
class BadRequest extends ExtendableError {
    /**
     * creates an instance of the ExtendableError
     * 
     * @constructor
     * @param {*} message contains the error message
     */
    constructor(message) {
        super(message);
        this.name = 'BadRequest';
    };

    // method to get error code(status) for that error
    getCode() { return 400; };

    // method to get condition for that error
    getCondition() { return 'Bad Request' }
};


/** @class Unauthorised representing a 401 Unauthorised Error */
class Unauthorised extends ExtendableError {
    /**
     * creates an instance of the ExtendableError
     * 
     * @constructor
     * @param {*} message contains the error message
     */
    constructor(message) {
        super(message);
        this.name = 'Unauthorised';
    };

    // method to get error code(status) for that error
    getCode() { return 401; };

    // method to get condition for that error
    getCondition() { return 'You are not authorised to access this!' };
};


/** @class Forbidden representing a 403 Forbidden Error */
class Forbidden extends ExtendableError {
    /**
     * creates an instance of the ExtendableError
     * 
     * @constructor
     * @param {*} message contains the error message
     */
    constructor(message) {
        super(message);
        this.name = 'Forbidden';
    };

    // method to get error code(status) for that error
    getCode() { return 403; };

    // method to get condition for that error
    getCondition() { return 'Forbidden Site' };
};


/** @class NotFound representing a 404 Not Found Error */
class NotFound extends ExtendableError {
    /**
     * creates an instance of the ExtendableError
     * 
     * @constructor
     * @param {*} message contains the error message
     */
    constructor(message) {
        super(message);
        this.name = 'Not Found';
    };

    // method to get error code(status) for that error
    getCode() { return 404; };

    // method to get condition for that error
    getCondition() { return 'Content not found' };
};


/** @class Conflict representing a 409 Conflict Error */
class Conflict extends ExtendableError {
    /**
     * creates an instance of the ExtendableError
     * 
     * @constructor
     * @param {*} message contains the error message
     */
    constructor(message) {
        super(message);
        this.name = 'Conflict';
    };

    // method to get error code(status) for that error
    getCode() { return 409; };

    // method to get condition for that error
    getCondition() { return 'Conflict' };
};


/** @class UnprocessableEntity representing a 422 UnprocessableEntity Error */
class UnprocessableEntity extends ExtendableError {
    /**
     * creates an instance of the ExtendableError
     * 
     * @constructor
     * @param {*} message contains the error message
     */
    constructor(message) {
        super(message);
        this.name = 'Unprocessable Entity';
    };

    // method to get error code(status) for that error
    getCode() { return 422; };

    // method to get condition for that error
    getCondition() { return 'Content already exists' };
};


module.exports = { ExtendableError, BadRequest, Unauthorised, Forbidden, NotFound, Conflict, UnprocessableEntity };