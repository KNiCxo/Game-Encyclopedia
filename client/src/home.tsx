// Import packages
import {useState, useEffect, type JSX} from 'react'
import {Link} from 'react-router-dom'
import slugify from 'slugify'

// Import styles
import './styles/home.css'

// Import types
import type {PopularNewReleasesResults} from '../../project-types.ts'

// Import page components and functions
import Header from './header/header.tsx'
import {getPopularNewReleases} from './search-utils.ts'

// Home page 
function Home() {
  // Array of search results for popular new releases
  const [popularNewReleases, setPopularNewReleases] = useState<PopularNewReleasesResults[]>([]);

  // Displays popular new release results if array is populated
  function displayResults(): JSX.Element {
    if (popularNewReleases.length > 0) {
      return (
        <>
          <div className='pnr-results'>
            {popularNewReleases.map((entry) => {
              const slugGameName = slugify(entry.name, {
                lower: true,
                replacement: '_',
                strict: true
              });

              return(
                <>
                  <Link to={`/games/${entry.id}/${slugGameName}`} className='link'>
                    <div className='pnr-card'>
                      <img src={`https://images.igdb.com/igdb/image/upload/t_1080p/${entry.cover.image_id}.jpg`} alt="" />
                      
                      <div className='pnr-title'>
                        <p>{entry.name}</p>
                      </div>
                    </div>
                  </Link>
                </>
              )
            })}
          </div>
        </>
      );
    } else {
      return(<div className='loader'></div>);
    }
  }

  // Get popular new releases on component mount
  useEffect(() => {
    getPopularNewReleases().then((data) => {
      setPopularNewReleases(data);
    });
  }, []);

  return(
    <>
      {/* Home Page Header */}
      <Header></Header>

      {/* Hero Text */}
      <h2 className='hero-text'>Your definitive source for video game knowledge. Start exploring now.</h2>

      {/* Popular New Releases */}
      <div className='pnr-div'>
        <div className='pnr-header-div'>
          <h1>Popular New Releases</h1>
        </div>

        {displayResults()}
      </div>
    </>
  )
}

export default Home