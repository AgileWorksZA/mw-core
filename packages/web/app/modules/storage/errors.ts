export class StorageError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
  ) {
    super(message);
    this.name = "StorageError";
  }
}

export class DocumentNotFoundError extends StorageError {
  constructor(type: string, id: string) {
    super(
      `Document "${type}/${id}" does not exist`,
      404,
      "DOCUMENT_NOT_FOUND",
    );
  }
}

export class TimestampNotFoundError extends StorageError {
  constructor(timestamp: number, type: string, id: string) {
    super(
      `Timestamp "${timestamp}" for "${type}/${id}" does not exist`,
      404,
      "TIMESTAMP_NOT_FOUND",
    );
  }
}

export class ValidationError extends StorageError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class ConcurrencyError extends StorageError {
  constructor(message: string) {
    super(message, 409, "CONCURRENCY_ERROR");
  }
}