export class RequestError extends Error {
  constructor(response: Response, msg: string) {
    const message = `GraphQL Request Error ( ${response.status} ): ${msg}`;

    super(message);

    this.name = "RequestError";
  }
}
