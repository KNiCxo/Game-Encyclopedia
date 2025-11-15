// Import types
import type {GameData} from '../../../project-types.ts'

// Typesetting for props
type BannerContentProps = {
  gameData: GameData
}

function BannerContent(props: BannerContentProps) {
  // Stores URL for banner image on page
  let bannerURL: string = '';

  // If artworks do not exist, use screenshots
  // Else, use black banner
  if (!props.gameData.artworks) {
    if (!props.gameData.screenshots) {
      bannerURL = `/black.png`
    } else {
      // Picks random number to decide image from screenshots array
      const randomNum = Math.floor(Math.random() * props.gameData.screenshots.length);
      
      bannerURL = `https://images.igdb.com/igdb/image/upload/t_1080p/${props.gameData.screenshots[randomNum].image_id}.jpg`;
    }
  } else {
    // Picks random number to decide image from artworks array
    const randomNum = Math.floor(Math.random() * props.gameData.artworks.length);

    bannerURL = `https://images.igdb.com/igdb/image/upload/t_1080p/${props.gameData.artworks[randomNum].image_id}.jpg`;
  }

  return(
    <div className='banner-content'>
      {/* Game banner */}
      <img src={bannerURL} alt="" className='banner'/>

      {/* Game name */}
      <div className='game-name-div'>
        <h1 className='game-name'>{props.gameData.name}</h1>
      </div>

      <div className='rating-div'>
              <img src="/public/star.png" alt="" className='rating-img'/>
              <span className='rating'>{Math.ceil(props.gameData.rating) / 10}</span>
      </div>
    </div>
  )
}

export default BannerContent