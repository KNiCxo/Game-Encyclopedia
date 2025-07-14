import { useState, useEffect, type JSX } from 'react'

import './styles/home.css'

// Import page components */
import Header from './header.tsx'
import {getPopularNewReleases} from './searchUtils.ts'

/* Home page */
function Home() {
  /* Type for IGDB popular new releases query */
  type pnrResult = {
    cover: {
      id: number,
      image_id: string
    },
    id: number,
    name: string
  }

  /* Array of search results for popular new releases */
  const [popularNewReleases, setPopularNewReleases] = useState<pnrResult[]>([]);

  /* Displays popular new release results if array is populated */
  function displayResults(): JSX.Element {
    if (popularNewReleases.length > 0) {
      return (
        <>
          <div className='pnr-results'>
            {popularNewReleases.map((entry) => {
              return(
                <>
                  <div className='pnr-card'>
                    <img src={`https://images.igdb.com/igdb/image/upload/t_1080p/${entry.cover.image_id}.jpg`} alt="" />
                    
                    <div className='pnr-title'>
                      <p>{entry.name}</p>
                    </div>
                  </div>
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

  /* Get popular new releases on component mount */
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