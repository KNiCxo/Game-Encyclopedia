// Import packages
import {useState, useEffect, type JSX} from 'react'
import {Link} from 'react-router-dom'
import slugify from 'slugify'

// Import styles
import './styles/top100.css'

// Import types
import type {Top100Results} from '../../project-types.ts'

// Import components and functions
import Header from './header/header.tsx'
import {getTop100} from './search-utils.ts'

function Top100() {
  // Array of Top 100 games
  const [top100Data, setTop100Data] = useState<Top100Results[]>([]);

  // Displays Top 100 results
  function displayResults(): JSX.Element {
      if (top100Data.length > 0) {
        return (
          <>
            {/* List of Top 100 games */}
            <div className='top100-results'>
              {/* Iterate though data */}
              {top100Data.map((entry, index) => {
                // Slugify game name for link
                const slugGameName = slugify(entry.name, {
                  lower: true,
                  replacement: '_',
                  strict: true
                });

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

                return(
                  <>
                    <Link to={`/games/${entry.id}/${slugGameName}`} className='link entry-odd'>
                      {/* Entry */}
                      <div className='top100-entry'>
                        {/* Entry placement */}
                        <div className='top100-number'>
                          {index + 1}
                        </div>

                        {/* Game */}
                        <div className='top100-game'>
                          {/* Game cover */}
                          {entry.cover && (
                            <div key={entry.cover.image_id} className='top100-game-cover'>
                              <img className='top100-game-img' src={`https://images.igdb.com/igdb/image/upload/t_1080p/${entry.cover.image_id}.jpg`} alt="" />
                            </div>
                          )}

                          {/* Name, year, rating, and platforms list */}
                          <div className='top100-game-info'>
                            <span className='top100-game-name'>{entry.name}</span>

                            <div className='top100-rating-div'>
                              <img src="/public/star.png" alt="" className='rating-img top100-star'/>
                              <span className='game-rating'>{Math.ceil(entry.rating) / 10}</span>
                            </div>

                            {!Number.isNaN(gameYear) && <span className='top100-game-year'>{gameYear}</span>}
                            {entry.platforms && <span className='top100-game-platforms'>{platformsList}</span>}
                          </div>
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
    getTop100().then((data) => {
      setTop100Data(data);
    });
  }, []);

  return(
    <>
      {/* Header */}
      <Header></Header>

      <h1 className='top100-header'>Top 100 Highest Rated Games on IGDB.</h1>

      {displayResults()}
    </>
  )
}

export default Top100