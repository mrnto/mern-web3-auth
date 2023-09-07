export enum StatusCodes {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500
}

class HttpError extends Error {
    status: number;

    constructor(status: number, message?: string) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
    }
}

export default HttpError;
