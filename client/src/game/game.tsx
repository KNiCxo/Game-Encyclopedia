// Import packages
import {useState, useEffect, type JSX} from 'react'
import {useParams} from 'react-router-dom'
import slugify from 'slugify'

// Import styling
import '../styles/game.css'

// Import types
import type {GameData} from '../../../project-types.ts'

// Import components
import Header from '../header/header.tsx'
import BannerContent from './banner-content.tsx'
import MainContent from './main-content.tsx'

// Import functions
import {gatherGameData, getPlayerCount} from '../search-utils.ts'

// Game page
function Game() {
  // Get game id from URL parameter
  const {gameId} = useParams<{gameId: string}>();

  // Get game name from URL parameter
  const {gameName} = useParams<{gameName: string}>();

  // Track if game exists
  const [gameExists, setGameExists] = useState<boolean>(true);

  // Track if videos have loaded
  const [videosLoaded, setVideosLoaded] = useState<boolean>(false);

  // Stores all game data from IGDB
  const [gameData, setGameData] = useState<GameData[] | null>(null);

  // Stores player count from Steam Charts
  const [playerCount, setPlayerCount] = useState<number | null>(null);
  
  // Fetches game data from server and updates variable
  function storeGameData(): void {
    // Make call to IGDB for game data
    gatherGameData(gameId)
      .then((gameDataRes: GameData[] | null) => {
        setGameData(gameDataRes);

        // If there are no videos, set videosLoaded to true so that page content loads
        if(!gameDataRes?.[0].videos) {
          setVideosLoaded(true);
        }
      })
      .catch(() => {
        setGameExists(false);
      });
    
    // Make call to Steam Charts for player count
    getPlayerCount(gameName)
      .then((playerCountRes: string) => {
        // Get tbody from Steam Charts
        const parser: DOMParser = new DOMParser();
        const doc: Document = parser.parseFromString(playerCountRes, 'text/html');
        const tbody: HTMLTableSectionElement | null = doc.querySelector('tbody');

        // If tbody exists, find the correct game from Steam Chart's search results
        if (tbody) {
          // Start at first row
          let rows: number = 0;

          // Iterate through table rows
          while (rows < tbody.rows.length) {
            // Slugify Steam Chart entry
            const steamChartGame: string = slugify(tbody.rows[rows].cells[1].querySelector('a')?.innerHTML || '', {
              lower: true,
              replacement: '_',
              strict: true
            });

            // If Steam Chart entry matches game name then break out of loop
            if (steamChartGame !== gameName) {
              rows++;
            } else {
              break;
            }
          }

          // Sets player count with proper Steam chart entry
          setPlayerCount(Number(tbody?.rows[rows].cells[2].innerHTML));
        }
      })
      .catch(() => {
        setPlayerCount(null);
      })
  }

  // Displays game data
  function displayData(): JSX.Element {
    // Only display if gameData exists
    if (gameData) {
      return(
        <>
          {/* Banner content */}
          <BannerContent gameData={gameData[0] || ''}></BannerContent>

          {/* Main content */}
          <MainContent gameData={gameData[0] || ''} 
                       setVideosLoaded={setVideosLoaded} 
                       playerCount={playerCount}
                       gameName={gameName}>
          </MainContent>
        </>
      )
    } else {
      return(<></>)
    }
  }

  /* Reset state variables and fetch game data when gameId updates */
  useEffect(() => {
    setVideosLoaded(false);
    setGameExists(true);
    setGameData(null);
    setPlayerCount(null);
    storeGameData();
  }, [gameId]);

  return(
    <>
      {/* Header */}
      <Header></Header>

      {/* Loader*/}
      {(!videosLoaded && gameExists) && <div className='loader game-page-loader'></div>}

      {/* Game Data */}
      {<div className='game-data' style={{display: videosLoaded ? 'flex' : 'none' }}>{displayData()}</div>}

      {/* Error message */}
      {!gameExists && <h1 className='game-not-found'>No results found</h1>}
    </>
  )
}

export default Game