// Import packages
import mysql, {RowDataPacket, ResultSetHeader} from 'mysql2/promise'
import dotenv from 'dotenv'
import slugify from 'slugify'

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
  
  // Updates list_table and create new list
  async createEntry(name: string): Promise<void> {
    try {
      // Update list_table
      const updateQuery = `INSERT INTO list_table
                           (ListName, GameCount, PinnedGameURL1, PinnedGameURL2, PinnedGameURL3, PinnedGameURL4)
                           VALUES (?, 0, '', '', '', '');`;

      // Execute query
      const [result] = await pool.execute<ResultSetHeader>(updateQuery, [name]);

      // Slug name and add it's id to the end
      let sluggedName = slugify(name, {
        lower: true,
        replacement: '_',
        strict: true
      });

      sluggedName = sluggedName + `_${result.insertId}`;

      // Ensure table name is safe
      const tableName = mysql.escapeId(sluggedName);
      
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
    } catch (error) {
      console.log(error);
    }
  }

  // Deletes list and updates list_table
  async deleteEntry(name: string, id: number): Promise<void> {
    try {
      // Slug name and add it's id to the end
      let sluggedName = slugify(name, {
        lower: true,
        replacement: '_',
        strict: true
      });

      sluggedName = sluggedName + `_${id}`;

      // Drop table
      const deleteQuery = `DROP TABLE ${sluggedName}`;

      // Execute query
      await pool.execute(deleteQuery);

      // Update list_table
      const updateQuery = 'DELETE from list_table WHERE ListId = ?'

      await pool.execute (updateQuery, [id]);

    } catch (error) {
      console.log(error);
    }
  }
}
