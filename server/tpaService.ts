/* Creates delay for so that loading spinner is on the screen longer */
function delay(ms: number): Promise<void>{
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Returns results based on recent games that have a high rating count in descending order
export const popularNewReleases = async () => {
  // Current date
  const currentDate = (Math.floor(Date.now() / 1000));

  // 30 days from current date
  const earliestReleaseDate = currentDate - 2629743;

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
        body: `fields cover.image_id,name,genres.name; 
               where (first_release_date > ${earliestReleaseDate}) & (first_release_date < ${currentDate}) & (rating_count >= 5);
               sort first_release_date desc;
               limit 10;`
    });

    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Gets 4 results based on game name
export const searchGameLite = async (gameName: string) => {
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
        body: `search "${gameName}"; fields cover.image_id,name; limit 4;`
    });

    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Gets 10 paginated results based on game name
export const searchGame = async (gameName: string, offset: string) => {
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
        body: `search "${gameName}"; fields first_release_date,cover.image_id,name,platforms.name; offset: ${offset}; limit 10;`
    });

    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Gets info for a single game
export const gatherGameData = async (gameId: string) => {
  try {
    const response = await fetch(
      "https://api.igdb.com/v4/games", { 
        method: 'POST',
        headers: {
        'Accept': 'application/json',
          'Client-ID': `${process.env.CLIENT_ID}`,
          'Authorization': `Bearer ${process.env.AUTH}`,
        },
        body: `fields age_ratings.organization.name, age_ratings.rating_category.rating, artworks.image_id, name, screenshots.image_id; where id = ${gameId};`
      }); 

      if (!response.ok) {
        throw new Error();
      }
      
      return await response.json();
  } catch (error) {
    throw error;
  }
}