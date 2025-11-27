// Import packages
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import type {PopularNewReleasesResults, SearchResultsLite, SearchResultsMain, GameData, Top100} from '../project-types.ts';

// Import services
// import { DbService }  from './dbService';
import * as tpaService from './tpa-service';

// Create server instance
const app: Express = express();

// Format server
app.use(cors());
dotenv.config();

// GET request for gathering a list of popular new game releases
app.get('/popularNewReleases', async (req: Request, res: Response) => {
  try {
    const data:PopularNewReleasesResults = await tpaService.popularNewReleases();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({message: 'Internal server error'});
  }
});

// GET request for gathering search results based on a game name parameter
app.get('/searchGameLite/:gameName', async (req: Request, res: Response) => {
  try {
    const data:SearchResultsLite = await tpaService.searchGameLite(req.params.gameName);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({message: 'Internal server error'});
  }
});

// GET request for gathering more search results with more fields
app.get('/searchGame/:gameName/:offset', async (req: Request, res: Response) => {
  try {
    const data:SearchResultsMain = await tpaService.searchGame(req.params.gameName, req.params.offset);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({message: 'Internal server error'});
  }
});

// GET request for information on a particular game based on it's ID
app.get('/gatherGameData/:gameId', async (req: Request, res: Response) => {
  try {
    const data:GameData = await tpaService.gatherGameData(req.params.gameId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).end();
  }
});

// GET request for player count based on game name
app.get('/getPlayerCount/:gameName', async (req: Request, res: Response) => {
  try {
    const data:string = await tpaService.getPlayerCount(req.params.gameName);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).end();
  }
});

// GET request for Top 100 highest rated games on IGDB
app.get('/top100', async (req: Request, res: Response) => {
  try {
    const data:Top100[] = await tpaService.top100();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).end();
  }
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Now listening on port ${process.env.PORT}`);
});