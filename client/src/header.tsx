import {useState, useEffect, type JSX} from 'react'
import {Link} from 'react-router-dom'
import slugify from 'slugify'

import './styles/header.css'

import {searchGameLite} from './searchUtils.ts'

// Project header 
function Header() {
  // Stores search results
  const [searchResultsLite, setSearchResultsLite] = useState<searchResultLite[]>([]);

  // Value from search bar input
  const [searchInput, setSearchInput] = useState<string>('');

  // Debounced search bar input
  const [debouncedInput, setDebouncedInput] = useState<string>('');

  // Track if results were found
  const [notFound, setNotFound] = useState<boolean>(false);

  // Type for IGDB results based on game name search parameter 
  type searchResultLite = {
    cover: {
      id: number,
      image_id: string
    },
    id: number,
    name: string
  }

  // Get search results from server and update state variable
  function setResults(gameName: string) {
    searchGameLite(gameName).then((newResults: searchResultLite[]) => {
      if (newResults.length >= 0) {
        setSearchResultsLite(newResults);
      }

      // If no results were returned, set notFound to true
      // Else, set to false
      if (newResults.length === 0) {
        setNotFound(true);
      } else {
        setNotFound(false);
      }
    });
  }

  // Displays search results if loaded
  function displayResults(): JSX.Element {
    // Make game name input URL friendly
    const searchTermSlug = slugify(debouncedInput, {
      lower: true,
      replacement: '_',
      strict: true
    });

    // If there are results, then display the first 4
    // Else if search was made but no results were found, display error message
    if (searchResultsLite.length > 0) {
      return(
        <>
          {/* Iterate through results */}
          {searchResultsLite.map((entry) => {
            // Make result URL friendly
            const resultSlug = slugify(entry.name, {
              lower: true,
              replacement: '_',
              strict: true
            });

            return(
              <>
                {/* Entry */}
                <Link to={`/games/${resultSlug}`} className='link'>
                  <div className='search-lite-item'>
                    {/* Game Cover */}
                    {entry.cover && (<img className='search-lite-cover' src={`https://images.igdb.com/igdb/image/upload/t_1080p/${entry.cover.image_id}.jpg`} alt="" />)}
                    
                    {/* Game Name */}
                    <span className='search-lite-name'>{entry.name}</span>
                  </div>
                </Link>
              </>
            )
          })}
          
          {/* Links to all results */}
          <Link to={`/search/${searchTermSlug}`} className='link'>
            <div className='all-results-div'>
              <span>See all results</span>
            </div>
          </Link>
        </>
      );
    } else if (notFound) {
      return(
        <>
          {/* Error message */}
          <h1 className='not-found'>No results found</h1>

          {/* Link to al results */}
          <Link to={`/search/${searchTermSlug}`}>
            <div className='all-results-div'>
              <span>See all results</span>
            </div>
          </Link>
        </>
      );
    } else {
      return(<></>);
    }
  }

  // Delays search by 500ms
  useEffect(() => {
    const searchHandler = setTimeout(() => {
      setDebouncedInput(searchInput);
    }, 500);

    return () => {
      clearTimeout(searchHandler);
    }
  }, [searchInput]);

  // If search has been delayed by 500ms then fetch request from server
  useEffect(() => {
    if (debouncedInput) {
      setResults(debouncedInput);
    } else {
      // Clears results and set notFound to false
      setSearchResultsLite([]);
      setNotFound(false);
    }
  }, [debouncedInput])

  return(
    <>
      {/* Header */}
      <div className='header'>
        <div className='header-top'>
          {/* Logo */}
          <div className='header-logo'>
            <img className='header-logo' src="/public/gamepad.png" alt="" />
            <h1>GAME ENCYCLOPEDIA</h1>
          </div>

          {/* List Link */}
          <img className='menu' src="/public/menu.png" alt="" />
        </div>

        {/* Search Bar */}
        <div className='search-div'>
          <input className='search' type="text" placeholder='Search' onChange={e => setSearchInput(e.target.value)}/>
          <img className='search-icon' src="/public/search.png" alt="" />
        </div>

        {/* Displays search results */}
        <div className='search-results-lite'>
          {displayResults()}
        </div>
      </div>
    </>
  )
}

export default Header