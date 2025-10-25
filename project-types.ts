// Type for IGDB popular new releases query 
export type PopularNewReleasesResults = {
  cover: {
    id: number,
    image_id: string
  },
  id: number,
  name: string
}

  // Type for IGDB simplified search results query
  export type SearchResultsLite = {
    cover: {
      id: number,
      image_id: string
    },
    id: number,
    name: string
  }

// Type for IGDB search results query
export type SearchResults = {
  cover: {
    id: number,
    image_id: string
  },
  first_release_date: number,
  id: number,
  name: string
  platforms: {id: number, name: string}[]
}

// Type for IGDB game data query
export type GameData = {
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
  genres: {
    id: number,
    name: string
  }[],
  themes: {
    id: number,
    name: string
  }[],
  game_modes: {
    id: number,
    name: string
  }[],
  age_ratings: {
    id: number, 
    organization: {id: number, name: string}, 
    rating_category: {id: number, rating: string}
  }[]
}