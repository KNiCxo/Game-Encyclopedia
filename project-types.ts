// IGDB popular new releases query 
export type PopularNewReleasesResults = {
  cover: {
    id: number,
    image_id: string
  },
  id: number,
  name: string
}

// IGDB simplified search results query
export type SearchResultsLite = {
  cover: {
    id: number,
    image_id: string
  },
  id: number,
  name: string
}

// IGDB search results query
export type SearchResultsMain = {
  cover: {
    id: number,
    image_id: string
  },
  first_release_date: number,
  id: number,
  name: string
  platforms: {id: number, name: string}[]
}

// IGDB game data query
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
  rating: number,
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
  player_perspectives: {
    id: number,
    name: string
  }[],
  game_engines: {
    id: number,
    name: string
  }[],
  dlcs: {
    id: number,
    cover: {
      id: number,
      image_id: string
    },
    name: string
  }[],
  language_supports: {
    id: number,
    language: {
      id: number,
      name: string
    },
    language_support_type: {
      id: number,
      name: string
    }
  }[],
  release_dates: {
    id: number,
    date: number,
    human: string,
    platform: {
      id: number,
      name: string,
    }
  }[],
  age_ratings: {
    id: number, 
    organization: {id: number, name: string}, 
    rating_category: {id: number, rating: string}
  }[]
}

// IGDB Top 100
export type Top100Results = {
  id: number,
  cover: {
    id: number,
    image_id: string
  },
  name: string,
  rating: number,
  first_release_date: number,
  platforms: {id: number, name: string}[]
}

// IGDB Coming Soon
export type ComingSoonResults = {
  id: number,
  cover: {
    id: number;
    image_id: string
  },
  name: string
}

// DB List Table
export type ListTable = {
  ListId: number,
  ListName: string,
  GameCount: number,
  PinnedGameURL1: string,
  PinnedGameURL2: string,
  PinnedGameURL3: string,
  PinnedGameURL4: string,
  SluggedName: string
}

// DB List Data
export type ListData = {
  EntryId: number,
  GameId: number,
  CoverArt: string,
  GameName: string,
  Year: string,
  Platforms: string,
  IsPinned: number,
  DatePinned: string
  SluggedName: string,
}

// DB List Names + Ids
export type ListNames = {
  ListId: number,
  ListName: string,
  SluggedName: string,
  GameExists: number | boolean
}

// Adding game to list
export type AddGameEntry = {
  listName: string,
  listId: number,
  gameId: number,
  cover: string,
  name: string,
  year: string,
  platforms: string,
  sluggedName: string
}

// Adding game to list
export type RemoveGameEntry = {
  listName: string,
  listId: number,
  gameId: number,
}

// Editing list name
export type EditName = {
  listName: string,
  listId: string,
  newName: string
}

// Pinning game in list
export type PinGame = {
  listName: string,
  entryId: number,
  pinState: boolean
}