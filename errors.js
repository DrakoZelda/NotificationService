class APIError extends Error {
  constructor(status, errorCode, message) {
    super(message || `status: ${status} errorCode: ${errorCode}`);
    this.status = status;
    this.errorCode = errorCode;
  }
}

class NotFoundError extends APIError {
  constructor(message = null) {
    super(404, 'RESOURCE_NOT_FOUND', message);
  }
}

class RelatedResourceNotFoundError extends APIError {
  constructor(message = null) {
    super(404, 'RELATED_RESOURCE_NOT_FOUND', message);
  }
}

class BadRequestError extends APIError {
  constructor(message = null) {
    super(400, 'BAD_REQUEST', message);
  }
}

module.exports = {
  APIError,
  NotFoundError,
  RelatedResourceNotFoundError,
  BadRequestError,
};
