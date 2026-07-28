export class HttpException extends Error {
    public readonly statusCode: number;
    public readonly status: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode;
        Object.setPrototypeOf(this, HttpException.prototype);
    }
}