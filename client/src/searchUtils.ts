
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
  platforms: object[]
}

// Get more search results and with more fields
export const searchGame = async (gameName: string): Promise<searchResult[]> => {
  if (gameName) {
    try {
      const response = await fetch(`http://localhost:4001/searchGame/${gameName}`);
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
