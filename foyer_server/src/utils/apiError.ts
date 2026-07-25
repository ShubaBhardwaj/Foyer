/**
 * Standardized API Error class for operational errors.
 */
class ApiError extends Error {
  statusCode: number;
  errors: any[];

  constructor(statusCode: number, message: string, errors: any[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad request", errors: any[] = []): ApiError {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = "Unauthorized", errors: any[] = []): ApiError {
    return new ApiError(401, message, errors);
  }

  static forbidden(message = "Forbidden", errors: any[] = []): ApiError {
    return new ApiError(403, message, errors);
  }

  static notFound(message = "Not found", errors: any[] = []): ApiError {
    return new ApiError(404, message, errors);
  }

  static conflict(message = "Conflict", errors: any[] = []): ApiError {
    return new ApiError(409, message, errors);
  }

  static validation(message = "Validation error", errors: any[] = []): ApiError {
    return new ApiError(422, message, errors);
  }

  static internal(message = "Internal server error", errors: any[] = []): ApiError {
    return new ApiError(500, message, errors);
  }
}

export default ApiError;
