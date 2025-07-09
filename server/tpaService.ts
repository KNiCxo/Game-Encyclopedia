// Returns results based on a game name
export const searchGames = async (gameName: string) => {
  try {
    const response = await fetch(
      "https://api.igdb.com/v4/games", { 
        method: 'POST',
        headers: {
        'Accept': 'application/json',
          'Client-ID': `${process.env.CLIENT_ID}`,
          'Authorization': `Bearer ${process.env.AUTH_1}`,
        },
        body: `search "${gameName}"; fields first_release_date,cover.image_id,name,platforms.name; limit 5;`
    });

    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Returns results based on recent games that have a high rating count in descending order
export const popularNewReleases = async () => {
  // 1 month from current date
  const earliestReleaseDate = Math.floor((Date.now() / 1000) - 2629743);

  try {
    const response = await fetch(
      "https://api.igdb.com/v4/games", { 
        method: 'POST',
        headers: {
        'Accept': 'application/json',
          'Client-ID': `${process.env.CLIENT_ID}`,
          'Authorization': `Bearer ${process.env.AUTH_1}`,
        },
        body: `fields cover.image_id,name,genres.name; 
               where (first_release_date > ${earliestReleaseDate}) & (rating_count >= 6);
               sort first_release_date desc;
               limit 10;`
    });

    return await response.json();
  } catch (error) {
    throw error;
  }
}
