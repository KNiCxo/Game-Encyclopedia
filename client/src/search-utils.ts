
// Type for IGDB popular new releases query
type pnrResult = {
  cover: {
    id: number,
    image_id: string
  },
  id: number,
  name: string
}

// Gets popular new release search results 
export const getPopularNewReleases = async (): Promise<pnrResult[]>  => {
  try {
    const response = await fetch('http://localhost:4001/popularNewReleases');
    const json = await response.json();
    return (json);
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Type for IGDB results based on game name search parameter 
type searchResultLite = {
  cover: {
    id: number,
    image_id: string
  },
  id: number,
  name: string
}

// Get search results based on game name
export const searchGameLite = async (gameName: string): Promise<searchResultLite[]> => {
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

// Type for IGDB search results but returns more data
type searchResult = {
  cover: {
    id: number,
    image_id: string
  },
  first_release_date: number,
  id: number,
  name: string
  platforms: {id: number, name: string}[]
}

// Get more search results and with more fields
export const searchGame = async (gameName: string | undefined, offset: string): Promise<searchResult[]> => {
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

  // Type for game data received from server
  type gameDataType = {
    id: number,
    artworks: {
      id: number,
      image_id: string
    }[],
    screenshots: {
      id: number,
      image_id: string
    }[],
    name: string,
    videos: {
      id: number,
      video_id: string
    }[],
    cover: {
      id: number,
      image_id: string
    },
    first_release_date: number,
    involved_companies: {
      id: number,
      company: {
        id: number,
        name: string
      },
      developer: boolean,
      publisher: boolean
    }[],
    summary: string,
    age_ratings: {
      id: number, 
      organization: {id: number, name: string}, 
      rating_category: {id: number, rating: string}
    }[]
  }

// Gets info for a single game
export const gatherGameData = async (gameId: string | undefined): Promise<gameDataType[] | []> => {
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