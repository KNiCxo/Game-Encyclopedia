import {useState, useEffect, type JSX} from 'react'
import {useParams} from 'react-router-dom'

import './styles/game.css'

import Header from './header.tsx'
import {gatherGameData} from './searchUtils.ts'

function Game() {
  // Get game id from URL parameter
  const {gameId} = useParams<{gameId: string}>();

  // Track if game exists
  const [gameExists, setGameExists] = useState<boolean>(true);

  // Type for game data received from server
  type gameDataType = {
    id: number,
    age_ratings: {
      id: number, 
      organization: {id: number, name: string}, 
      rating_category: {id: number, rating: string}
    }[],
    artworks: {
      id: number,
      image_id: string
    }[],
    screenshots: {
      id: number,
      image_id: string
    }[],
    name: string
  }

  // Stores all game data
  const [gameData, setGameData] = useState<gameDataType[] | null>(null);
  
  // Fetches game data from server and updates variable
  function storeGameData() {
    gatherGameData(gameId)
      .then((gameDataRes: gameDataType[]) => {
        setGameData(gameDataRes);
      })
      .catch(() => {
        setGameExists(false);
      });
  }

  // Displays game data
  function displayData(): JSX.Element {
    // Only display if gameData exists
    if (gameData) {
      console.log(gameData);

      // Stores URL for banner image on page
      let bannerURL: string = '';

      // If artworks does not exist, use screenshots
      // Else, use black banner
      if (!gameData[0].artworks) {
        if (!gameData[0].screenshots) {
          bannerURL = `/black.png`
        } else {
          // Picks random number to decide image from screenshots array
          const randomNum = Math.floor(Math.random() * gameData[0].screenshots.length);
          
          bannerURL = `https://images.igdb.com/igdb/image/upload/t_1080p/${gameData[0].screenshots[randomNum].image_id}.jpg`;
        }
      } else {
        // Picks random number to decide image from artworks array
        const randomNum = Math.floor(Math.random() * gameData[0].artworks.length);

        bannerURL = `https://images.igdb.com/igdb/image/upload/t_1080p/${gameData[0].artworks[randomNum].image_id}.jpg`;
      }

      return(
        <>
          {/* Banner content */}
          <div className='banner-content'>
            {/* Game banner */}
            <img src={bannerURL} alt="" className='banner'/>

            {/* Game name */}
            <h1 className='game-name'>{gameData[0].name}</h1>
          </div>
          
          <div className='main-content'>
            {/* Age ratings header */}
            <span className='age-ratings-header'>Age Ratings</span>

            {/* Displays if age_ratings doesn't exist */}
            {!gameData[0].age_ratings && <span className='data-not-found'>-</span>}

            {/* Age ratings container */}
            <div className='age-ratings'>
              {/* Iterate through age ratings array if it exists */}
              {gameData[0].age_ratings?.map((entry, _) => {
                return(
                  <>
                    {/* Indiviual age rating */}
                    <div className='age-rating'>
                      {/* Age rating image */}
                      <img src={`/age-rating/${entry.organization.name}/${entry.rating_category.rating}.png`} alt="" className={`${entry.organization.name}`}/>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        </>
      )
    } else {
      return(<></>)
    }
  }

  /* Fetch game data when gameId updates */
  useEffect(() => {
    storeGameData()
  }, [gameId]);

  return(
    <>
      {/* Header */}
      <Header></Header>

      {/* Game Data */}
      <div className='game-data'>{displayData()}</div>

      {/* Error message */}
      {!gameExists && <h1 className='game-not-found'>No results found</h1>}
    </>
  )
}

export default Game