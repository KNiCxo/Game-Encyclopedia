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

// Top 100
function Top100() {
  // Array of Top 100 games
  const [top100Data, setTop100Data] = useState<Top100Results[]>([]);

  // Displays Top 100 results
  function displayResults():JSX.Element {
      if (top100Data.length > 0) {
        return (
          <>
            <div className='top100-results'>
              {top100Data.map((entry) => {
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
                    <Link to={`/games/${entry.id}/${slugGameName}`} className='link'>
                      <div className='search-entry'>
                        {/* Game cover */}
                        {entry.cover && (
                          <div key={entry.cover.image_id} className='search-entry-cover'>
                            <img className='search-entry-img' src={`https://images.igdb.com/igdb/image/upload/t_1080p/${entry.cover.image_id}.jpg`} alt="" />
                          </div>
                        )}

                        {/* Name, year, and platforms list */}
                        <div className='search-entry-info'>
                          <span className='search-entry-name'>{entry.name}</span>
                          {!Number.isNaN(gameYear) && <span className='search-entry-year'>{gameYear}</span>}
                          {entry.platforms && <span className='search-entry-platforms'>{platformsList}</span>}
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