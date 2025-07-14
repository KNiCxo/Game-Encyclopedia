import {useState, useEffect, type JSX} from 'react';

import './styles/header.css'

import {searchGameLite} from './searchUtils.ts';

// Project header 
function Header() {
  // Stores search results
  const [searchResultsLite, setSearchResultsLite] = useState<searchResultLite[]>([]);

  // Value from search bar input
  const [searchInput, setSearchInput] = useState<string>('');

  // Debounced search bar input
  const [debouncedInput, setDebouncedInput] = useState<string | undefined>('');

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
    searchGameLite(gameName).then(setSearchResultsLite);
  }

  // Displays search results if loaded
  function displayResults(): JSX.Element {
    if (searchResultsLite.length > 0) {
      return(
        <>
          {searchResultsLite.map((entry) => {
            console.log(entry);
            return(
              <>
                <div className='search-lite-item'>
                  {entry.cover && (<img className='search-lite-cover' src={`https://images.igdb.com/igdb/image/upload/t_1080p/${entry.cover.image_id}.jpg`} alt="" />)}
                  <span className='search-lite-name'>{entry.name}</span>
                </div>
              </>
            )
          })}
        </>
      )
    } else {
      return(<></>)
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
      setSearchResultsLite([]);
    }
  }, [debouncedInput])

  return(
    <>
      {/* Header */}
      <div className='header'>
        <div className='header-top'>
          {/* Logo */}
          <div className='header-logo'>
            <img className='header-logo' src="gamepad.png" alt="" />
            <h1>GAME ENCYCLOPEDIA</h1>
          </div>

          {/* List Link */}
          <img className='list-link' src="list.png" alt="" />
        </div>

        {/* Search Bar */}
        <div className='search-div'>
          <input className='search' type="text" placeholder='Search' onChange={e => setSearchInput(e.target.value)}/>
          <img className='search-icon' src="search.png" alt="" />
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