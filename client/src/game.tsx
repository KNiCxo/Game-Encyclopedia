import {useState, useEffect, type JSX} from 'react'
import {useParams} from 'react-router-dom'
import {format} from 'date-fns';

import './styles/game.css'

import Header from './header.tsx'
import VideoSlider from './video-slider.tsx'
import {gatherGameData} from './search-utils.ts'

function Game() {
  // Get game id from URL parameter
  const {gameId} = useParams<{gameId: string}>();

  // Track if game exists
  const [gameExists, setGameExists] = useState<boolean>(true);

  // Track if summary is extended
  const [isExtended, setIsExtended] = useState<boolean>(false);

  // Type for game data received from server
  type gameDataType = {
    id: number,
    artworks: {
      id: number,
      image_id: string
    }[],
    screenshots: {
      id: number,
      image_id: string
    }[],
    name: string,
    videos: {
      id: number,
      video_id: string
    }[],
    cover: {
      id: number,
      image_id: string
    },
    first_release_date: number,
    involved_companies: {
      id: number,
      company: {
        id: number,
        name: string
      },
      developer: boolean,
      publisher: boolean
    }[],
    summary: string,
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

      let initialSummary = gameData[0].summary.substring(0, 200);
      let extendedSummary = gameData[0].summary.substring(200);

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
            {/* Video slider */}
            {gameData[0].videos && <VideoSlider videos={gameData[0].videos}></VideoSlider>}

            {/* Cover container */}
            <div className='cover-container info-container'>
              {!gameData[0].cover && <img src='/public/no-cover.png' alt='' className='cover'></img>}
              {gameData[0].cover && <img src={`https://images.igdb.com/igdb/image/upload/t_1080p/${gameData[0].cover.image_id}.jpg`} alt='' className='cover'></img>}

              <div className='cover-container-info'>
                  {/* Release Date*/}
                  <div className='game-info-container'>
                    <span className='game-info-header'>Release Date</span>
                    <span className='game-info'>{formattedReleaseDate}</span>
                  </div>

                  {/* Main Developers */}
                  <div className='game-info-container'>
                    <span className='game-info-header'>Main Developers</span>
                    {!gameData[0].involved_companies && <span className='data-not-found'>-</span>}
                    {gameData[0].involved_companies && gameData[0].involved_companies.map((entry) => {
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
                    <span className='game-info-header'>Publishers</span>
                    {!gameData[0].involved_companies && <span className='data-not-found'>-</span>}
                    {gameData[0].involved_companies && gameData[0].involved_companies.map((entry) => {
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

            {/* Summary */}
            {gameData[0].summary && <div className='summary-container info-container'>
              <span className='summary-header'>Summary</span>

              <div className='summary'>
                <span>{initialSummary}</span>
                {(gameData[0].summary.length > 200 && !isExtended) && <span className='dots'>... </span>}
                {isExtended && <span>{extendedSummary}</span>}
                {gameData[0].summary.length > 200 && <span className='more-button' onClick={() => setIsExtended(prev => !prev)}>{isExtended ? ' Less' : ' More'}</span>}
              </div>
            </div>}

            {/* Age ratings header */}
            <span className='age-ratings-header game-info-header'>Age Ratings</span>

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