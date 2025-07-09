import { useState, useEffect, type JSX } from 'react'

import './styles/home.css'

// Import page components */
import Header from './header.tsx'

/* Home page */
function Home() {
  /* Declare type for IGDB API results */
  type Result = {
    cover: {
      id: number,
      image_id: string
    },
    id: number,
    name: string
  }

  /* Array of search results for popular new releases */
  const [popularNewReleases, setPopularNewReleases] = useState<Result[]>([]);

  /* Gets popular new release search results */
  const getPopularNewReleases = async () => {
    const response = await fetch('http://localhost:4001/popularNewReleases');
    const json = await response.json();
    console.log(json);
    setPopularNewReleases(json);
  }

  /* Displays popular new release results if array is populated */
  function displayResults(): JSX.Element {
    return (
      <>
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
      </>
    );
  }

  /* Get popular new releases on component mount */
  useEffect(() => {
    getPopularNewReleases();
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

        <div>
          {popularNewReleases.length > 0 && displayResults()}
        </div>
      </div>
    </>
  )
}

export default Home