// Import packages
import {Link} from 'react-router-dom'

// Typesetting for props
type DLCProps = {
  dlcs: {
    id: number,
    cover: {
      id: number,
      image_id: string
    },
    name: string
  }[],
  gameName: string | undefined
}

function DLC(props: DLCProps) {
  return(
    <>
      {props.dlcs && <div className='dlc-div'>
        <div className='dlcs-container info-container'>
          {/* Header */}
          <span className='container-header'>DLCs</span>
          
          {/* DLC entries */}
          <div className='dlc-entry-container'>
            {/* Iterate through entries */}
            {props.dlcs.map((entry, _) => {
              return(
                <>
                  <Link to={`/games/${entry.id}/${props.gameName}`} className='link'>
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
    </>
  )
}

export default DLC