// Import types
import type {PopularNewReleasesResults, SearchResultsLite, SearchResults, GameData} from '../project-types.ts';

/* Creates delay for so that loading spinner is on the screen longer */
function delay(ms: number): Promise<void>{
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Returns results based on recent games that have a high rating count in descending order
export const popularNewReleases = async ():Promise<PopularNewReleasesResults> => {
  // Current date
  const currentDate = (Math.floor(Date.now() / 1000));

  // 30 days from current date
  const earliestReleaseDate = currentDate - 2592000;

  try {
    // Run 300ms delay for increased loading spinner visibility
    await delay(300);

    // Gets games with a rating count of 5 or more and released within the past 30 days
    // and returns the cover image, name, and genres
    const response = await fetch(
      "https://api.igdb.com/v4/games", { 
        method: 'POST',
        headers: {
        'Accept': 'application/json',
          'Client-ID': `${process.env.CLIENT_ID}`,
          'Authorization': `Bearer ${process.env.AUTH}`,
        },
        body: `fields cover.image_id, name, genres.name;
               where (first_release_date > ${earliestReleaseDate}) & (first_release_date < ${currentDate}) & (rating_count >= 5);
               sort rating_count desc;
               limit 10;`
    });

    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Gets 4 results based on game name
export const searchGameLite = async (gameName: string): Promise<SearchResultsLite> => {
  try {
    // Returns game cover and name fields
    const response = await fetch(
      "https://api.igdb.com/v4/games", { 
        method: 'POST',
        headers: {
        'Accept': 'application/json',
          'Client-ID': `${process.env.CLIENT_ID}`,
          'Authorization': `Bearer ${process.env.AUTH}`,
        },
        body: `search "${gameName}"; fields cover.image_id, name; limit 4;`
    });

    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Gets 10 paginated results based on game name
export const searchGame = async (gameName: string, offset: string):Promise<SearchResults> => {
  try {
    // Run 300ms delay for increased loading spinner visibility
    await delay(1000);
    
    // Returns game first release date, cover, name, and platforms fields
    const response = await fetch(
      "https://api.igdb.com/v4/games", { 
        method: 'POST',
        headers: {
        'Accept': 'application/json',
          'Client-ID': `${process.env.CLIENT_ID}`,
          'Authorization': `Bearer ${process.env.AUTH}`,
        },
        body: `search "${gameName}"; fields first_release_date, cover.image_id, name, platforms.name; 
              offset: ${offset}; limit 10;`
    });

    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Gets info for a single game
export const gatherGameData = async (gameId: string): Promise<GameData> => {
  try {
    const response = await fetch(
      "https://api.igdb.com/v4/games", { 
        method: 'POST',
        headers: {
        'Accept': 'application/json',
          'Client-ID': `${process.env.CLIENT_ID}`,
          'Authorization': `Bearer ${process.env.AUTH}`,
        },
        body: `fields
              artworks.image_id,
              screenshots.image_id,
              name,
              videos.video_id,
              cover.image_id,
              first_release_date,
              involved_companies.developer,
              involved_companies.publisher,
              involved_companies.company.name,
              summary,
              genres.name,
              themes.name,
              game_modes.name,
              player_perspectives.name,
              game_engines.name,
              dlcs.name,
              dlcs.cover.image_id,
              language_supports.language.name,
              language_supports.language_support_type.name,
              age_ratings.organization.name,
              age_ratings.rating_category.rating;
              where id = ${gameId};`
      }); 
      
      if (!response.ok) {
        throw new Error();
      }

      return await response.json();
  } catch (error) {
    throw error;
  }
}

// Gets game player count from Steam Charts
export const getPlayerCount = async (gameName: string):Promise<string> => {
  try {
    const response = await fetch(`https://steamcharts.com/search/?q=${gameName}`);

    if (!response.ok) {
      throw new Error();
    }

    return await response.text();
  } catch (error) {
    throw error;
  }
}