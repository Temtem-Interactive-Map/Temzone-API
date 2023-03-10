export class NotFoundError extends Error {
  constructor(request) {
    super("The " + request + " was not found");

    this.request = request;
  }
}

export class InternalServerError extends Error {}
