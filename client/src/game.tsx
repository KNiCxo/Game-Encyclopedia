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
    }[]
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
    if (gameData) {
      console.log(gameData);
      return(
        <>
          {/* Age ratings header */}
          <span className='age-ratings-header'>Age Ratings</span>

          {/* Age ratings container */}
          <div className='age-ratings'>
            {/* Iterate through age ratings array */}
            {gameData[0].age_ratings.map((entry, _) => {
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