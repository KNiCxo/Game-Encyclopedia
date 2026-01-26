// Import packages
import mysql, {RowDataPacket, ResultSetHeader} from 'mysql2/promise'
import dotenv from 'dotenv'
import slugify from 'slugify'

// Types
import type {GameData, ListTable, ListData, ListNames, AddGameEntry, RemoveGameEntry, EditName, PinGame} from '../project-types.ts'

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

  // Get all lists and their data from database for My List page
  async getLists(): Promise<ListTable[]>{
    try {
      const query = `SELECT * FROM list_table;`;

      const [rows] = await pool.execute<(ListTable & RowDataPacket)[]>(query);

      for (const row of rows) {
        const pinnedGamesQuery = `SELECT CoverArt FROM ${row.SluggedName}_${row.ListId}
                                  ORDER BY IsPinned DESC,
                                  CASE WHEN IsPinned = TRUE THEN DatePinned END ASC,
                                  EntryId ASC LIMIT 4;`;

        const [pins] = await pool.execute<RowDataPacket[]>(pinnedGamesQuery);
        for (let i = 0; i < pins.length; i++) {
          row[`PinnedGameURL${i+1}`] = pins[i].CoverArt ? pins[i].CoverArt : '';
        }
      }
      
      return rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Get list name from database from id
  async getListName(listId: number): Promise<string>{
    try {
      // Get list names and ids
      const listNameQuery = `SELECT ListName FROM list_table WHERE ListId = ${listId};`;
      const [rows] = await pool.execute<RowDataPacket[]>(listNameQuery);
      
      return rows[0].ListName;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Get all list names from database and checks if game exists in that list already
  async getListNames(gameId: number): Promise<ListNames[]>{
    try {
      // Get list names and ids
      const listNamesQuery = `SELECT ListId, ListName, SluggedName FROM list_table;`;
      const [rows] = await pool.execute<(ListNames & RowDataPacket)[]>(listNamesQuery);

      // Check if game exists in lists
      for (let i = 0; i < rows.length; i++) {
        const tableName = rows[i].SluggedName + '_' + rows[i].ListId;
        const query = `SELECT EXISTS (SELECT 1 FROM ${tableName} WHERE GameId = ${gameId}) AS id_exists;`;
        const exists = await pool.execute<RowDataPacket[]>(query);
        rows[i].GameExists = exists[0][0].id_exists;
      }

      return rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Get game data from a specific list
  async getListData(id: number, name: string): Promise<ListData[]> {
    try { 
      // Get data from list
      const listQuery = `SELECT * FROM ${name}_${id}
                         ORDER BY IsPinned DESC,
                         CASE WHEN IsPinned = TRUE THEN DatePinned END ASC,
                         EntryId ASC;`
      const [rows] = await pool.execute<(ListData & RowDataPacket)[]>(listQuery);

      return rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  
  // Updates list_table and create new list
  async createEntry(name: string): Promise<void> {
    try {
      // Slug name and add it's id to the end
      let sluggedName = slugify(name, {
        lower: true,
        replacement: '_',
        strict: true
      });

      // Update list_table
      const updateQuery = `INSERT INTO list_table
                           (ListName, GameCount, SluggedName)
                           VALUES (?, 0, ?);`;

      // Execute query
      const [result] = await pool.execute<ResultSetHeader>(updateQuery, [name, sluggedName]);

      // Create slugged name
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
                       Platforms VARCHAR(500),
                       IsPinned BOOLEAN NOT NULL DEFAULT FALSE,
                       DatePinned DATETIME,
                       SluggedName VARCHAR(50) NOT NULL
                      );`;
      
      // Execute query
      await pool.execute(newTableQuery);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Adds game to list and updates list_table
  async addGame(gameData: AddGameEntry): Promise<void> {
    try {
      // Query that adds games to list
      const newGameQuery = `INSERT INTO ${gameData.listName}
                            (GameId, CoverArt, GameName, Year, Platforms, SluggedName)
                            VALUES(?, ?, ?, ?, ?, ?);`;

      // Execute query
      await pool.execute(newGameQuery, [gameData.gameId, gameData.cover, gameData.name, gameData.year, gameData.platforms, gameData.sluggedName]);

      // Update table's game count in list table
      const updateQuery = `UPDATE list_table
                           SET GameCount = GameCount + 1
                           WHERE ListId = ${gameData.listId};`;
      
      // Execute query
      await pool.execute(updateQuery);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Updates pin variable in list
  async updateListName(listData: EditName): Promise<void> {
    try {
      let sluggedListName = slugify(listData.listName, {
        lower: true,
        replacement: '_',
        strict: true
      });

      let sluggedNewName = slugify(listData.newName, {
        lower: true,
        replacement: '_',
        strict: true
      });
      
      // Rename table
      const renameQuery = `RENAME TABLE ${sluggedListName}_${listData.listId} TO ${sluggedNewName}_${listData.listId}`;

      // Execute query
      await pool.execute(renameQuery);

       // Update list_table query
      const updateQuery = `UPDATE list_table SET ListName = ?, SluggedName = ? WHERE ListId = ?;`;

      // Execute query
      await pool.execute(updateQuery, [listData.newName, sluggedNewName, listData.listId]);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Updates pin variable in list
  async pinGame(gameData: PinGame): Promise<void> {
    try {
      // Update game entry
      const query = `UPDATE ${gameData.listName}
                     SET IsPinned = ?, DatePinned = NOW()
                     WHERE EntryId = ?;`;

      // Execute query
      await pool.execute(query, [gameData.pinState, gameData.entryId]);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Deletes list and updates list_table
  async deleteEntry(name: string, id: number): Promise<void> {
    try {
      // Drop table
      const deleteQuery = `DROP TABLE ${name}_${id};`;

      // Execute query
      await pool.execute(deleteQuery);

      // Update list_table
      const updateQuery = 'DELETE from list_table WHERE ListId = ?;';

      // Execute query
      await pool.execute (updateQuery, [id]);

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Removes game from list and updates list_table
  async removeGame(gameData: RemoveGameEntry): Promise<void> {
    try {
      // Drop table
      const deleteGameQuery = `DELETE from ${gameData.listName} WHERE GameId = ?;`;

      // Execute query
      await pool.execute(deleteGameQuery, [gameData.gameId]);

      // Update table's game count in list table
      const updateQuery = `UPDATE list_table
                           SET GameCount = GameCount - 1
                           WHERE ListId = ${gameData.listId};`;

      // Execute query
      await pool.execute (updateQuery);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

}
