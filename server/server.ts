// Import packages
import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import type * as Types from '../project-types.ts'

// Import services
import * as tpaService from './tpa-service';
import {DbService} from './db-service.js';

// Create server instance
const app: Express = express();

// Enable dotenv
dotenv.config();

// Format server
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// GET request for gathering a list of popular new game releases
app.get('/popularNewReleases', async (req: Request, res: Response) => {
  try {
    const data: Types.PopularNewReleasesResults = await tpaService.popularNewReleases();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({message: 'Internal server error'});
  }
});

// GET request for gathering search results based on a game name parameter
app.get('/searchGameLite/:gameName', async (req: Request, res: Response) => {
  try {
    const data: Types.SearchResultsLite = await tpaService.searchGameLite(req.params.gameName);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({message: 'Internal server error'});
  }
});

// GET request for gathering more search results with more fields
app.get('/searchGame/:gameName/:offset', async (req: Request, res: Response) => {
  try {
    const data: Types.SearchResultsMain = await tpaService.searchGame(req.params.gameName, req.params.offset);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({message: 'Internal server error'});
  }
});

// GET request for information on a particular game based on it's ID
app.get('/gatherGameData/:gameId', async (req: Request, res: Response) => {
  try {
    const data: Types.GameData = await tpaService.gatherGameData(req.params.gameId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).end();
  }
});

// GET request for player count based on game name
app.get('/getPlayerCount/:gameName', async (req: Request, res: Response) => {
  try {
    const data: string = await tpaService.getPlayerCount(req.params.gameName);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).end();
  }
});

// GET request for Top 100 highest rated games on IGDB
app.get('/top100', async (req: Request, res: Response) => {
  try {
    const data: Types.Top100Results[] = await tpaService.top100();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).end();
  }
});

// GET request for anticipated coming soon games on IGDB
app.get('/comingSoon', async (req: Request, res: Response) => {
  try {
    const data: Types.ComingSoonResults[] = await tpaService.comingSoon();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).end();
  }
});

// GET request for gathering all lists and their data from the database
app.get('/getLists', async (req: Request, res: Response) => {
  try {
    const db = DbService.getDbServiceInstance();
    const data: Types.ListTable[] = await db.getLists();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).end();
  }
});

// GET request for gathering all list names from the database
app.get('/getListNames/:gameId', async (req: Request, res: Response) => {
  try {
    const db = DbService.getDbServiceInstance();
    const data: Types.ListNames[] = await db.getListNames(Number(req.params.gameId));

    res.status(200).json(data);
  } catch (error) {
    res.status(500).end();
  }
});

// GET request for gathering game data for a specific list
app.get('/getListData/:id', async (req: Request, res: Response) => {
  try {
    const db = DbService.getDbServiceInstance();
    const data: Types.ListData[] = await db.getListData(Number(req.params.id));
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).end();
  }
});

// POST request for creating a new list and updating list_table
app.post('/createEntry/:name', async (req: Request, res: Response) => {
  try {
    const db = DbService.getDbServiceInstance();
    await db.createEntry(req.params.name);

    res.status(200).end();
  } catch (error) {
    res.status(500).end();
  }
});

// POST request for adding a game to a list and updating list_table
app.post('/addGame', async (req: Request, res: Response) => {
  try {
    const db = DbService.getDbServiceInstance();
    await db.addGame(req.body);

    res.status(200).end();
  } catch (error) {
    res.status(500).end();
  }
});

// DELTE request for removing a list and updating list_table
app.delete('/deleteEntry/:name/:id', async (req: Request, res: Response) => {
  try {
    const db = DbService.getDbServiceInstance();
    await db.deleteEntry(req.params.name, Number(req.params.id));

    res.status(200).end();
  } catch (error) {
    res.status(500).end();
  }
});

// DELTE request for removing a game from a list and updating list_table
app.delete('/removeGame', async (req: Request, res: Response) => {
  try {
    const db = DbService.getDbServiceInstance();
    await db.removeGame(req.body);

    res.status(200).end();
  } catch (error) {
    res.status(500).end();
  }
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Now listening on port 4001`);
});