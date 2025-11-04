// Import packages
import {useState, useEffect, type JSX} from 'react'
import {useParams} from 'react-router-dom'
import {format} from 'date-fns'
import slugify from 'slugify'
import {Link} from 'react-router-dom'

// Import styling
import './styles/game.css'

// Import types
import type {GameData} from '../../project-types.ts'

// Import components and functions
import Header from './header.tsx'
import VideoSlider from './video-slider.tsx'
import {gatherGameData, getPlayerCount} from './search-utils.ts'

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

  // Track if summary is extended
  const [isExtended, setIsExtended] = useState<boolean>(false);

  // Stores all game data from IGDB
  const [gameData, setGameData] = useState<GameData[] | null>(null);

  // Stores player count from Steam Charts
  const [playerCount, setPlayerCount] = useState<number | null>(null);
  
  // Fetches game data from server and updates variable
  function storeGameData() {
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
        const parser = new DOMParser();
        const doc = parser.parseFromString(playerCountRes, 'text/html');
        const tbody = doc.querySelector('tbody');

        // If tbody exists, find the correct game from Steam Chart's search results
        if (tbody) {
          // Start at first row
          let rows = 0;

          // Iterate through table rows
          while (rows < tbody.rows.length) {
            // Slugify Steam Chart entry
            const steamChartGame = slugify(tbody.rows[rows].cells[1].querySelector('a')?.innerHTML || '', {
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
      console.log(gameData);

      // Stores URL for banner image on page
      let bannerURL: string = '';

      // If artworks do not exist, use screenshots
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

      // Formatted release date for game if release date exists
      let formattedReleaseDate:string;

      // If first release date exists, then set format to MM/DD/YYYY
      // Else, set to 'Unreleased'
      if (gameData[0].first_release_date) {
        let releaseDate:Date = new Date(gameData[0].first_release_date * 1000);
        formattedReleaseDate = format(releaseDate, 'MM/dd/yyyy');
      } else {
        formattedReleaseDate = 'Unreleased';
      }

      // Divies summary into two parts
      let initialSummary = gameData[0].summary.substring(0, 200);
      let extendedSummary = gameData[0].summary.substring(200);

      // Group support types with their respective language
      const groupLanguages = gameData[0].language_supports.reduce<Record<string, string[]>>((acc, item) => {
        // Get language name
        const language = item.language.name;

        // If language isn't in object, then add language
        if (!acc[language]) acc[language] = [];

        // Push language support type into respective array
        acc[language].push(item.language_support_type.name);
        return acc;
      }, {});
      
      console.log(groupLanguages);

      return(
        <>
          {/* Banner content */}
          <div className='banner-content'>
            {/* Game banner */}
            <img src={bannerURL} alt="" className='banner'/>

            {/* Game name */}
            <h1 className='game-name'>{gameData[0].name}</h1>
          </div>
          
          {/* Main content */}
          <div className='main-content'>
            {/* Video slider */}
            {gameData[0].videos && <VideoSlider videos={gameData[0].videos} setIsLoaded={setVideosLoaded}></VideoSlider>}

            {/* Cover container */}
            <div className='cover-container info-container'>
              {!gameData[0].cover && <img src='/public/no-cover.png' alt='' className='cover'></img>}
              {gameData[0].cover && <img src={`https://images.igdb.com/igdb/image/upload/t_1080p/${gameData[0].cover.image_id}.jpg`} alt='' className='cover'></img>}

              <div className='cover-info'>
                  {/* Release Date*/}
                  <div className='game-info-container'>
                    <span className='game-info-header'>Release Date</span>
                    <span className='game-info'>{formattedReleaseDate}</span>
                  </div>

                  {/* Main Developers */}
                  <div className='game-info-container'>
                    {/* Header */}
                    <span className='game-info-header'>Main Developers</span>

                    {/* If content doesn't exist */}
                    {!gameData[0].involved_companies && <span className='data-not-found'>-</span>}

                    {/* Developers */}
                    {gameData[0].involved_companies && gameData[0].involved_companies.filter(entry => entry.developer)
                    .slice(0,2).map((entry) => {
                      if (entry.developer) {
                        return(
                          <>
                            <span className='game-info'>{entry.company.name}</span>
                          </>
                        )
                      }
                    })}
                  </div>

                  {/* Publishers */}
                  <div className='game-info-container'>
                    {/* Header */}
                    <span className='game-info-header'>Publishers</span>

                    {/* If content doesn't exist */}
                    {!gameData[0].involved_companies && <span className='data-not-found'>-</span>}

                    {/* Publishers */}
                    {gameData[0].involved_companies && gameData[0].involved_companies.filter(entry => entry.publisher)
                    .slice(0,2).map((entry) => {
                      if (entry.publisher) {
                        return(
                          <>
                            <span className='game-info'>{entry.company.name}</span>
                          </>
                        )
                      }
                    })}
                  </div>
              </div>
            </div>
              
            {/* Player Count */}
            {typeof playerCount === 'number' && <div className='player-count-container info-container'>
              <span className='player-count'>Current players on Steam:&nbsp;{playerCount}</span>
            </div>}

            {/* Summary */}
            {gameData[0].summary && <div className='summary-container info-container'>
              <span className='container-header'>Summary</span>

              <div className='summary'>
                <span>{initialSummary}</span>
                {(gameData[0].summary.length > 200 && !isExtended) && <span className='dots'>...&nbsp;</span>}
                {isExtended && <span>{extendedSummary + ' '}</span>}
                {gameData[0].summary.length > 200 && <span className='more-button' onClick={() => setIsExtended(prev => !prev)}>{isExtended ? 'Less' : 'More'}</span>}
              </div>
            </div>}

            {/* Additional Info*/}
            {<div className='additional-info-container info-container'>
              {/* Left side */}
              <div>
                 {/* Genres */}
                <div className='game-info-container'>
                  {/*  Header */}
                  <span className='game-info-header'>Genres</span>

                  {/* Displays if content doesn't exist */}
                  {!gameData[0].genres && <span className='data-not-found'>-</span>}

                  {/* Iterate through genres array if it exists */}
                  {gameData[0].genres?.map((entry, _) => {
                    return(
                      <>
                        <span className='game-info'>{entry.name}</span>
                      </>
                    )
                  })}
                </div>

                {/* Themes */}
                <div className='game-info-container'>
                  {/* Header */}
                  <span className='game-info-header'>Themes</span>

                  {/* Displays if content doesn't exist */}
                  {!gameData[0].themes && <span className='data-not-found'>-</span>}

                  {/* Iterate through themes ratings array if it exists */}
                  {gameData[0].themes?.map((entry, _) => {
                    return(
                      <>
                        <span className='game-info'>{entry.name}</span>
                      </>
                    )
                  })}
                </div>
              </div>
              
              {/* Right side */}
              <div>
                {/* Game Modes */}
                <div className='game-info-container'>
                  {/* Header */}
                  <span className='game-info-header'>Game Modes</span>

                  {/* Displays if content doesn't exist */}
                  {!gameData[0].game_modes && <span className='data-not-found'>-</span>}

                  {/* Iterate through themes ratings array if it exists */}
                  {gameData[0].game_modes?.map((entry, _) => {
                    return(
                      <>
                        <span className='game-info'>{entry.name}</span>
                      </>
                    )
                  })}
                </div>

                {/* Player perspectives */}
                <div className='game-info-container'>
                  {/* Header */}
                  <span className='game-info-header'>Player Perspectives</span>

                  {/* Displays if content doesn't exist */}
                  {!gameData[0].player_perspectives && <span className='data-not-found'>-</span>}

                  {/* Iterate through themes ratings array if it exists */}
                  {gameData[0].player_perspectives?.map((entry, _) => {
                    return(
                      <>
                        <span className='game-info'>{entry.name}</span>
                      </>
                    )
                  })}
                </div>

                {/* Game engines */}
                <div className='game-info-container'>
                  {/* Header */}
                  <span className='game-info-header'>Game Engines</span>

                  {/* Displays if content doesn't exist */}
                  {!gameData[0].game_engines && <span className='data-not-found'>-</span>}

                  {/* Iterate through themes ratings array if it exists */}
                  {gameData[0].game_engines?.map((entry, _) => {
                    return(
                      <>
                        <span className='game-info'>{entry.name}</span>
                      </>
                    )
                  })}
                </div>
              </div>
            </div>}

            {/* DLCs */}
            {gameData[0].dlcs && <div className='dlc-div'>
              <div className='dlcs-container info-container'>
                {/* Header */}
                <span className='container-header'>DLCs</span>
                
                {/* DLC entries */}
                <div className='dlc-entry-container'>
                  {/* Iterate through entries */}
                  {gameData[0].dlcs.map((entry, _) => {
                    return(
                      <>
                        <Link to={`/games/${entry.id}/${gameName}`} className='link'>
                          {/* Entry */}
                          <div className='dlc-entry'>
                            {/* Cover */}
                            {!entry.cover && <img src='/public/no-cover.png' alt='' className='dlc-cover'></img>}
                            {entry.cover && <img src={`https://images.igdb.com/igdb/image/upload/t_1080p/${entry.cover.image_id }.jpg`} alt="" className='dlc-cover'/>}

                            {/* Name */}
                            <div className='dlc-name'>
                              <span>{entry.name}</span>
                            </div>
                          </div>
                        </Link>
                      </>
                    )
                  })}
                </div>
              </div>
            </div>}

            {/* Languages */}
            {gameData[0].language_supports && <div className='languages-container info-container'>
              {/* Header */}
              <span className='container-header'>Supported Languages</span>

              {/* Iterate through languages */}
              {Object.entries(groupLanguages).map(([language, type]) => {
                return(
                  <>
                    {/* Entry */}
                    <div className='language-entry'>
                      <span>{language}:</span>
                      <span className='support-type'> {type.join(', ')}</span>
                    </div>
                  </>
                )
              })}
            </div>}

            {/* Age Ratings header */}
            <span className='age-ratings-header game-info-header'>Age Ratings</span>

            {/* Displays if content doesn't exist */}
            {!gameData[0].age_ratings && <span className='data-not-found'>-</span>}

            {/* Age Ratings container */}
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

  /* Reset state variables and fetch game data when gameId updates */
  useEffect(() => {
  setVideosLoaded(false);
  setGameExists(true);
  setIsExtended(false);
  setGameData(null);
  setPlayerCount(null);

  storeGameData();
}, [gameId]);

  return(
    <>
      {/* Header */}
      <Header></Header>

      {/* Loader*/}
      {!videosLoaded && <div className='loader game-page-loader'></div>}

      {/* Game Data */}
      {<div className='game-data' style={{display: videosLoaded ? 'flex' : 'none' }}>{displayData()}</div>}

      {/* Error message */}
      {!gameExists && <h1 className='game-not-found'>No results found</h1>}
    </>
  )
}

export default Game