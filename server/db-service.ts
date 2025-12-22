// Import modules
import mysql, {RowDataPacket} from 'mysql2/promise'
import dotenv from 'dotenv'

// Types
import type {ListTable} from '../project-types.ts'

// Enable dotenv
dotenv.config();

// Create instance for MySQL
let instance: DbService | null = null;

// Create connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  port: Number(process.env.DB_PORT)
});

// SQL query functions
export class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }

  // Get all list names from database
  async getLists(): Promise<ListTable[]>{
    try {
      const query = `SELECT * FROM list_table`;

      const [rows] = await pool.execute<(ListTable & RowDataPacket)[]>(query)

      return rows;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  
  // Creates new list and updates list_table
  async createEntry(name: string): Promise<void> {
    try {
      // Ensure table name is safe
      const tableName = mysql.escapeId(name);
      
      // Creates new table
      const newTableQuery = `CREATE TABLE ${tableName} (
                       EntryId INT AUTO_INCREMENT PRIMARY KEY,
                       GameId INT NOT NULL,
                       CoverArt VARCHAR(6),
                       GameName VARCHAR(50) NOT NULL,
                       Year VARCHAR(4),
                       Platforms VARCHAR(150)
                      );`;
      
      // Execute query
      await pool.execute(newTableQuery);

      // Update list_table
      const updateQuery = `INSERT INTO list_table
                           (ListName, GameCount, PinnedGameURL1, PinnedGameURL2, PinnedGameURL3, PinnedGameURL4)
                           VALUES (?, 0, '', '', '', '');`;

      // Execute query
      await pool.execute(updateQuery, [name]);
      
    } catch (error) {
      console.log(error);
    }
  }
}
