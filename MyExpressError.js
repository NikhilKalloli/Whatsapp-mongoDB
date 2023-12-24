class MyExpressError extends Error {
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;
    }
};

module.exports = MyExpressError;    