// Import packages
import {format} from 'date-fns'

// Typesetting for props
type CoverProps = {
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
  }[]
}

// Component that contains game cover, initial release date, main devs, and publishers
function Cover(props: CoverProps) {
  // Formatted release date for game if release date exists
  let formattedReleaseDate: string;

  // If first release date exists, then set format to MM/DD/YYYY
  // Else, set to 'Unreleased'
  if (props.first_release_date) {
    const releaseDate: Date = new Date(props.first_release_date * 1000);
    formattedReleaseDate = format(releaseDate, 'MM/dd/yyyy');
  } else {
    formattedReleaseDate = 'Unreleased';
  }

  return(
    <div className='cover-container info-container'>
      {/* Cover */}
      {!props.cover && <img src='/public/no-cover.png' alt='' className='cover'></img>}
      {props.cover && <img src={`https://images.igdb.com/igdb/image/upload/t_1080p/${props.cover.image_id}.jpg`} alt='' className='cover'></img>}

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
            {!props.involved_companies && <span className='data-not-found'>-</span>}

            {/* Developers */}
            {props.involved_companies && props.involved_companies.filter(entry => entry.developer)
            .slice(0,2).map((entry) => {
              if (entry.developer) {
                return(
                  <span className='game-info'>{entry.company.name}</span>
                )
              }
            })}
          </div>

          {/* Publishers */}
          <div className='game-info-container'>
            {/* Header */}
            <span className='game-info-header'>Publishers</span>

            {/* If content doesn't exist */}
            {!props.involved_companies && <span className='data-not-found'>-</span>}

            {/* Publishers */}
            {props.involved_companies && props.involved_companies.filter(entry => entry.publisher)
            .slice(0,2).map((entry) => {
              if (entry.publisher) {
                return(
                  <span className='game-info'>{entry.company.name}</span>
                )
              }
            })}
          </div>
      </div>
    </div>
  )
}

export default Cover