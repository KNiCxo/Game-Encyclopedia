// Create instance for MySQL
let instance: DbService | null = null;

export class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }
}
