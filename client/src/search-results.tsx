import {useState, useEffect, useRef, useCallback, type JSX} from 'react'
import {useParams, Link} from 'react-router-dom'

import './styles/search-results.css'

// Import page components and functions */
import Header from './header.tsx'
import {searchGame} from './search-utils.ts'

// Component for search results page
function SearchResults() {
  // Get game name from URL parameter
  const {gameName} = useParams<{gameName: string}>();

  // Track results offset
  const [resultsOffset, setResultsOffset] = useState<number>(0);

  // Track if app is fetching results
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Track if results exist
  const [notFound, setNotFound] = useState<boolean>(false);

  // Track if there are more search results
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Create observer instance for infinite scrolling
  const observer = useRef<IntersectionObserver | null>(null);

  const lastGameElementRef = useCallback((node: HTMLDivElement | null) => {
    // Disconnect existing observer (if it exists)
    if (observer.current) observer.current.disconnect();

    // When the last element becomes visibile, increase offset field to trigger next batch of results
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) setResultsOffset(offset => offset + 10);
    });

    // Begin observing node (last element in list)
    if (node) observer.current.observe(node)
  }, [hasMore]);

  // Type for IGDB search results query
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

  // Stores search results
  const [searchResults, setSearchResults] = useState<searchResult[]>([]);

  // Gets search results and stores them. Also handles no results case and loading spinner state.
  function setResults() {
    // Enable loading spinner
    setIsLoading(true);

    // Get search results
    searchGame(gameName, resultsOffset.toString())
      .then((newResults: searchResult[]) => {
        // If results were returned, store them and flag that results were found
        if (newResults.length > 0) {
          setSearchResults(prevResults => [...prevResults, ...newResults]);
          setNotFound(false);
        }
        else {
          // If intial results are empty, flag that no results were found
          if (searchResults.length === 0) {
            setNotFound(true);
          }

          // No more results to fetch
          setHasMore(false);
        }

        // Disable loading spinner
        setIsLoading(false);
      });
  }
  
  // Displays list of games based on returned search results
  function displayResults(): JSX.Element {
    // Return JSX only if there are results
    if (searchResults.length > 0) {
      return(
        <>
          {/* Iterate through results to display them individually */}
          {searchResults.map((entry, index) => {
            // Get year from date
            const gameDate = new Date(entry.first_release_date * 1000)
            const gameYear = gameDate.getFullYear();

            // Stores list of platforms that the game exists on
            let platformsList = '';

            // If key exists then create platform list string
            if(entry.platforms) {
              entry.platforms.map((platform, index) => {
                platformsList += platform.name;

                // Add comma to all elements except the last
                if (index < entry.platforms.length - 1) {
                  platformsList += ', ';
                }
              });
            }

            // Search entry jsx
            const entryContent = 
              <div className='search-entry'>
                {/* Game cover */}
                {entry.cover && (
                  <div key={entry.cover.image_id} className='search-entry-cover'>
                    <img className='search-entry-img' src={`https://images.igdb.com/igdb/image/upload/t_1080p/${entry.cover.image_id}.jpg`} alt="" />
                  </div>
                )}

                {/* Name, year, and platforms list */}
                <div className='search-entry-info'>
                  <Link to={`/games/${entry.id}`} className='link'><span className='search-entry-name'>{entry.name}</span></Link>
                  {!Number.isNaN(gameYear) && <span className='search-entry-year'>{gameYear}</span>}
                  {entry.platforms && <span className='search-entry-platforms'>{platformsList}</span>}
                </div>
              </div>

            // Return entry but add observation hook if the result is the last in the list
            if (searchResults.length === index + 1) {
              return(
                <>
                  {/* Redirect to game's page*/}
                  <div ref={lastGameElementRef}>
                    {entryContent}
                  </div>
                </>
              )
            } else {
              return (
                <>
                  {/* Redirect to game's page*/}
                  {entryContent}
                </>
              )
            }
          })}
        </>
      )
    } else {
      return <></>;
    }
  }

  // Fetch results when game name is returned from the parameter or if offset number changes
  useEffect(() => {
    setResults()
  }, [gameName, resultsOffset]);

  // Reset state when new search is triggered
  useEffect(() => {
    if (gameName) {
      setSearchResults([]);
      setResultsOffset(0);
      setHasMore(true);
      setNotFound(false);
    }
  }, [gameName]);

  return (
    <>
      {/* Page header */}
      <Header></Header>

      {/* Search results */}
      <div className='search-entry-list'>{displayResults()}</div>

      {/* Loading spinner */}
      {isLoading && <div className='loader'></div>}

      {/* Error message */}
      {notFound && <h1 className='error-message'>Error: <br></br> No results found</h1>}
    </>
  )
}

export default SearchResults