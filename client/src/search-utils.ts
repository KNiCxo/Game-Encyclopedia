// Import types
import type {PopularNewReleasesResults, SearchResultsLite, SearchResultsMain, GameData, Top100Results, ComingSoonResults} from '../../project-types.ts';

// Gets popular new release search results 
export const getPopularNewReleases = async (): Promise<PopularNewReleasesResults[]>  => {
  try {
    const response = await fetch('http://localhost:4001/popularNewReleases');
    const json = await response.json();
    return (json);
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Get search results based on game name
export const searchGameLite = async (gameName: string): Promise<SearchResultsLite[]> => {
  if (gameName) {
    try {
      const response = await fetch(`http://localhost:4001/searchGameLite/${gameName}`);
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(error);
      return [];
    }
  } else {
    return [];
  }
}

// Get more search results and with more fields
export const searchGame = async (gameName: string | undefined, offset: string): Promise<SearchResultsMain[]> => {
  if (gameName) {
    try {
      const response = await fetch(`http://localhost:4001/searchGame/${gameName}/${offset}`);
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(error);
      return [];
    }
  } else {
    return [];
  }
}

// Gets info for a single game
export const gatherGameData = async (gameId: string | undefined): Promise<GameData[] | []> => {
  if (gameId) {
    try {
      const response = await fetch(`http://localhost:4001/gatherGameData/${gameId}`);

      if (!response.ok) {
          throw new Error();
      }

      const json = await response.json();
      return json;
    } catch (error) {
      throw error;
    }
  } else {
    return [];
  }
}

// Gets game's player count from Steam Charts
export const getPlayerCount = async (gameName: string | undefined): Promise<string> => {
  if (gameName) {
    try {
      const response = await fetch(`http://localhost:4001/getPlayerCount/${gameName}`);

      if (!response.ok) {
          throw new Error();
      }

      return await response.text();

    } catch (error){
      throw error;
    }
  } else {
    return '';
  }
}

// Gets list of the Top 100 games on IGDB
export const getTop100 = async (): Promise<Top100Results[]> => {
  try {
    const response = await fetch(`http://localhost:4001/top100`);

    if (!response.ok) {
        throw new Error();
    }

    const json = await response.json();
    return json;
  } catch (error) {
    throw error;
  }
}

// Gets list of the most highly anticipated games coming soon
export const getComingSoon = async (): Promise<ComingSoonResults[]> => {
  try {
    const response = await fetch(`http://localhost:4001/comingSoon`);

    if (!response.ok) {
        throw new Error();
    }

    const json = await response.json();
    return json;
  } catch (error) {
    throw error;
  }
}