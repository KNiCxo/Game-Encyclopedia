// Packages
import {useState, useEffect, type JSX} from 'react'
import {useParams, Link} from 'react-router-dom'

// Styling
import './styles/list.css'

// Types
import type {ListData} from '../../project-types.ts';

// Components & Functions
import Header from './header/header.tsx'
import {getListData} from './db-utils.ts'

function List() {
  // Stores list of games
  const [gamesList, setGamesList] = useState<ListData[]>([]);
  
  // Id of list in database
  const {listId} = useParams();

  // Track if app is fetching results
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Track if results exist
  const [notFound, setNotFound] = useState<boolean>(false);

  // Makes call to server and stores results
  const storeData = (id: number): void => {
    // Enable loading
    setIsLoading(true);

    getListData(id)
    .then((dataRes: ListData[]) => {
      // If response was found, update notFound and gameList
      setNotFound(false);
      setGamesList(dataRes);

      // Disable loading
      setIsLoading(false);
    })
    .catch(() => {
      setGamesList([]);
      setNotFound(true);
    });
  }

  // Displays game list
  function displayResults(): JSX.Element {
    if (gamesList.length > 0) {
      return(
        <>
        <div className='game-list-entries'>
          {/* Iterate through results to display them individually */}
          {gamesList.map((game, _) => {
            return(
              <>
                <Link to={`/games/${game.GameId}/${game.SluggedName}`} className='link'>
                <div className='game-list-entry'>
                  {/* Game cover */}
                  {game.CoverArt && (
                    <div className='game-list-entry-cover'>
                      <img className='game-list-entry-img' src={`https://images.igdb.com/igdb/image/upload/t_1080p/${game.CoverArt}.jpg`} alt="" />
                    </div>
                  )}

                  {/* Name, year, and platforms list */}
                  <div className='game-list-entry-info'>
                    <span className='game-list-entry-name'>{game.GameName}</span>
                    {!Number.isNaN(game.Year) && <span className='game-list-entry-year'>{game.Year}</span>}
                    {game.Platforms && <span className='game-list-entry-platforms'>{game.Platforms}</span>}
                  </div>
                </div>
                </Link>
              </>
            )
          })}
        </div>
        </>
      );
    } else {
      return (
        <h1 className='list-header'>List is empty. Search for games to add them to the list.</h1>
      )
    }
  }

  useEffect(() => {
    storeData(Number(listId));
  }, []);

  return(
    <>
      {/* Header */}
      <Header></Header>

      {/* Error message */}
      {notFound && <h1 className='error-message'>Error: <br></br> Page not found</h1>}

      {/* Display results */}
      {!isLoading && displayResults()}
    </>
  )
}

export default List