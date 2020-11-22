export class User {
  constructor(
    public email: string,
    public id: string,
    private _tokenExpirationDate: Date,
    public isAdmin: boolean
  ) {}

  get Date() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate)
      return null;
    return this.id;
  }
}
