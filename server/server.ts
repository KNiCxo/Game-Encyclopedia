// Required modules for server
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Import services
// import { DbService }  from './dbService';
import * as tpaService from './tpaService';

// Create server instance
const app: Express = express();

// Format server
app.use(cors());
dotenv.config();

// GET request for gathering a list of popular new game releases
app.get('/popularNewReleases', async (req: Request, res: Response) => {
  try {
    const data = await tpaService.popularNewReleases();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({message: 'Internal server error'});
  }
});

// GET request for gathering search results based on a game name parameter
app.get('/searchGameLite/:gameName', async (req: Request, res: Response) => {
  try {
    const data = await tpaService.searchGameLite(req.params.gameName);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({message: 'Internal server error'});
  }
});

// GET request for gathering more search results with more fields
app.get('/searchGame/:gameName/:offset', async (req: Request, res: Response) => {
  try {
    const data = await tpaService.searchGame(req.params.gameName, req.params.offset);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({message: 'Internal server error'});
  }
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Now listening on port ${process.env.PORT}`);
});
