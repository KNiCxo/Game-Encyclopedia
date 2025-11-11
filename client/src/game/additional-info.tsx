// Typsetting for props
type AdditionalInfoProps = {
  genres: {
    id: number,
    name: string
  }[],
  themes: {
    id: number,
    name: string
  }[],
  game_modes: {
    id: number,
    name: string
  }[],
  player_perspectives: {
    id: number,
    name: string
  }[],
  game_engines: {
    id: number,
    name: string
  }[]
}

function AdditionalInfo(props: AdditionalInfoProps) {
  return(
    <div className='additional-info-container info-container'>
      {/* Left side */}
      <div>
        {/* Genres */}
        <div className='game-info-container'>
          {/*  Header */}
          <span className='game-info-header'>Genres</span>

          {/* Displays if content doesn't exist */}
          {!props.genres && <span className='data-not-found'>-</span>}

          {/* Iterate through genres array if it exists */}
          {props.genres?.map((entry, _) => {
            return(
              <span className='game-info'>{entry.name}</span>
            )
          })}
        </div>

        {/* Themes */}
        <div className='game-info-container'>
          {/* Header */}
          <span className='game-info-header'>Themes</span>

          {/* Displays if content doesn't exist */}
          {!props.themes && <span className='data-not-found'>-</span>}

          {/* Iterate through themes ratings array if it exists */}
          {props.themes?.map((entry, _) => {
            return(
              <span className='game-info'>{entry.name}</span>
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
          {!props.game_modes && <span className='data-not-found'>-</span>}

          {/* Iterate through themes ratings array if it exists */}
          {props.game_modes?.map((entry, _) => {
            return(
              <span className='game-info'>{entry.name}</span>
            )
          })}
        </div>

        {/* Player perspectives */}
        <div className='game-info-container'>
          {/* Header */}
          <span className='game-info-header'>Player Perspectives</span>

          {/* Displays if content doesn't exist */}
          {!props.player_perspectives && <span className='data-not-found'>-</span>}

          {/* Iterate through themes ratings array if it exists */}
          {props.player_perspectives?.map((entry, _) => {
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
          {!props.game_engines && <span className='data-not-found'>-</span>}

          {/* Iterate through themes ratings array if it exists */}
          {props.game_engines?.map((entry, _) => {
            return(
              <>
                <span className='game-info'>{entry.name}</span>
              </>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AdditionalInfo