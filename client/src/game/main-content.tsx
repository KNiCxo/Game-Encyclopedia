// Import packages
import {type Dispatch, type SetStateAction} from 'react'

// Import types
import type {GameData} from '../../../project-types.ts'

// Import components
import VideoSlider from './video-slider.tsx'
import Cover from './cover.tsx'
import AddGame from './add-game.tsx'
import Summary from './summary.tsx'
import AdditionalInfo from './additional-info.tsx'
import DLC from './dlc.tsx'
import Languages from './languages.tsx'
import ReleaseDates from './release-dates.tsx'
import AgeRatings from './age-ratings.tsx'

// Typesetting for props
type MainContentProps = {
  gameData: GameData,
  setVideosLoaded: Dispatch<SetStateAction<boolean>>,
  playerCount: number | null,
  gameName: string | undefined
}

// Component that contains most of the game data
function MainContent(props: MainContentProps) {
  return(
    <div className='main-content'>
      {/* Video slider */}
      {props.gameData.videos && <VideoSlider videos={props.gameData.videos} setIsLoaded={props.setVideosLoaded}></VideoSlider>}

      {/* Cover container */}
      <Cover cover={props.gameData.cover}
            first_release_date={props.gameData.first_release_date}
            involved_companies={props.gameData.involved_companies}>
      </Cover>

      {/* Add game to list button */}
      <AddGame gameId={props.gameData.id} gameName={props.gameName} gameData={props.gameData}></AddGame>

      {/* Player Count & Rating*/}
      {typeof props.playerCount === 'number' && <div className='player-count-container info-container'>
        <span className='player-count'>Current players on Steam:&nbsp;{props.playerCount}</span>
      </div>}
      
      {/* Summary */}
      <Summary summary={props.gameData.summary}></Summary>

      {/* Additional Info */}
      <AdditionalInfo genres={props.gameData.genres}
                      themes={props.gameData.themes}
                      game_modes={props.gameData.game_modes}
                      player_perspectives={props.gameData.player_perspectives}
                      game_engines={props.gameData.game_engines}>
      </AdditionalInfo>

      {/* DLCs */}
      <DLC dlcs={props.gameData.dlcs}></DLC>

      {/* Languages */}
      <Languages language_supports={props.gameData.language_supports}></Languages>

      {/* Release Dates */}
      <ReleaseDates release_dates={props.gameData.release_dates}></ReleaseDates>
            
      {/* Age Ratings */}
      <AgeRatings age_ratings={props.gameData.age_ratings}></AgeRatings>
    </div>
  )
}

export default MainContent