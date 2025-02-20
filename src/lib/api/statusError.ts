export default class StatusError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'Status Error';
  }
}
