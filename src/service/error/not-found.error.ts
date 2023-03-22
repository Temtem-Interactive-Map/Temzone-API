export class NotFoundError extends Error {
  public readonly request: string;

  constructor(request: string) {
    super("The " + request + " was not found");

    this.request = request;
  }
}
