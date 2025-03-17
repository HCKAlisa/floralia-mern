export interface ErrorWithStatus extends Error {
    statusCode: string
}

export const errorHandler = (statusCode: string, message: string) => {
    const error = new Error() as ErrorWithStatus;
    error.statusCode = statusCode;
    error.message = message;
    return error;

};