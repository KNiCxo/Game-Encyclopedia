// Import packages
import {useState, useRef, useEffect, type JSX} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import slugify from 'slugify'

// Import styling
import '../styles/header.css'
import '../styles/dropdown.css'

// Import types
import type {SearchResultsLite} from '../../../project-types.ts';

// Import components and functions
import Dropdown from './dropdown.tsx'
import {searchGameLite} from '../search-utils.ts'

// Project header 
function Header() {
  // Enable navigate hook
  const navigate = useNavigate();

  // State variable for showing/hiding elements
  const [showDropdown, setShowDropdown] = useState(false);

  // Overlay
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Stores search results
  const [searchResultsLite, setSearchResultsLite] = useState<SearchResultsLite[]>([]);

  // Value from search bar input when user types
  const [searchInput, setSearchInput] = useState<string>('');

  // Reference to input field to get its current value at any time
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Debounced search bar input
  const [debouncedInput, setDebouncedInput] = useState<string>('');

  // Track if results were found
  const [notFound, setNotFound] = useState<boolean>(false);

  // Displays or hides dropdown menu
  function displayDropdown() {
    // Toggle overlay
    if (overlayRef.current) {
      overlayRef.current.style.display = overlayRef.current.style.display === 'block' ? 'none' : 'block';
    }

    setShowDropdown(prevState => !prevState);
  }

  // Get search results from server and update state variable
  function setResults(gameName: string) {
    searchGameLite(gameName).then((newResults: SearchResultsLite[]) => {
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

  // Makes string URL friendly
  function slug(gameName: string): string {
    const slugString = slugify(gameName, {
      lower: true,
      replacement: '_',
      strict: true
    });

    return slugString;
  }

  // Displays search results if loaded
  function displayResults(): JSX.Element {
    // Slug game name
    const searchTermSlug = slug(debouncedInput);

    // If there are results, then display the first 4
    // Else if search was made but no results were found, display error message
    if (searchResultsLite.length > 0) {
      if (overlayRef.current) {
        overlayRef.current.style.display = 'block';
      }

      return(
        <>
          {/* Iterate through results */}
          {searchResultsLite.map((entry) => {
            return(
              <>
                {/* Entry */}
                <Link to={`/games/${entry.id}/${slug(entry.name)}`} className='link'>
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

          {/* Link to all results */}
          <Link to={`/search/${searchTermSlug}`} className='link'>
            <div className='all-results-div'>
              <span>See all results</span>
            </div>
          </Link>
        </>
      );
    } else {
      if (overlayRef.current) {
        overlayRef.current.style.display = 'none';
      }

      return(<></>);
    }
  }

  // Delays search by 300ms
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
      {/* Overlay */}
      <div ref={overlayRef} className='results-overlay'></div>

      {/* Header */}
      <div className='header'>
        <div className='header-top'>
          {/* Logo */}
          <Link to='/' className='link'>
            <div className='header-logo'>
              <img className='header-logo' src="/public/gamepad.png" alt="" />
              <h1>GAME ENCYCLOPEDIA</h1>
            </div>
          </Link>

          {/* List Link */}
          <img className='menu' src="/public/menu.png" alt="" onClick={displayDropdown} />
        </div>

        {/* Search Bar */}
        <div className='search-div'>
          <input className='search' type="text" placeholder='Search' 
                 ref={inputRef}
                 onChange={e => setSearchInput(e.target.value)} 
                 onBlur={() => {
                  setTimeout(() => {
                    setSearchResultsLite([]);
                    setSearchInput('');
                  }, 200)
                 }}
          />
          <img className='search-icon' src="/public/search.png" alt="" 
                onClick={() => {
                if (inputRef.current?.value) {
                  navigate(`/search/${slug(inputRef.current.value)}/`)
                }}}
          />
        </div>

        {/* Displays search results */}
        <div className='search-results-lite'>
          {displayResults()}
        </div>
      </div>

      {/* Dropdown */}
      <Dropdown open={showDropdown} onClose={displayDropdown}></Dropdown>
    </>
  )
}

export default Header