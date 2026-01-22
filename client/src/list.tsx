// Packages
import {useState, useEffect, type JSX} from 'react'
import {useParams, Link} from 'react-router-dom'

// Styling
import './styles/list.css'

// Types
import type {ListData} from '../../project-types.ts';

// Components & Functions
import Header from './header/header.tsx'
import {getListData, getListName, pinGame, removeGame} from './db-utils.ts'

function List() {
  // Stores list of games
  const [gamesList, setGamesList] = useState<ListData[]>([]);
  
  // Id of list in database
  const {listId} = useParams();

  // Regular list name
  const [listName, setListName] = useState('');

  // Slugged name of list in database
  const {sluggedName} = useParams();

  // Track if app is fetching results
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Track if results exist
  const [notFound, setNotFound] = useState<boolean>(false);

  // Makes call to server to get list name and data and stores it
  const getData = (id: number, name: string | undefined): void => {
    // Enable loading
    setIsLoading(true);

    // List data
    getListData(id, name)
    .then((dataRes: ListData[]) => {
      // If response was found, update notFound and gamesList
      setNotFound(false);
      setGamesList(dataRes);
    })
    .catch(() => {
      // If response was not found, set gamesList to empty and flag notFound
      setGamesList([]);
      setNotFound(true);
    });

    // List name
    getListName(id)
    .then((dataRes: string) => {
      setListName(dataRes);
    })
    .catch(() => {
    });

    // Disable loading
    setIsLoading(false);
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
                  <div className='game-list-entry'>
                    {/* Game cover */}
                    {game.CoverArt && (
                      <div className='game-list-entry-cover'>
                        <img className='game-list-entry-img' src={`https://images.igdb.com/igdb/image/upload/t_1080p/${game.CoverArt}.jpg`} alt="" />
                      </div>
                    )}

                    {/* Name, year, and platforms list */}
                    <div className='game-list-entry-info'>
                      <Link to={`/games/${game.GameId}/${game.SluggedName}`} className='link'>
                        <span className='game-list-entry-name'>{game.GameName}</span>
                      </Link>
                      {!Number.isNaN(game.Year) && <span className='game-list-entry-year'>{game.Year}</span>}
                      {game.Platforms && <span className='game-list-entry-platforms'>{game.Platforms}</span>}
                    </div>

                    {/* Game pin and delete icons */}
                    <div className='edit-game-div'>
                      <div className='game-pin-div' onClick={() => pinEntry(game.EntryId, Boolean(game.IsPinned))}>
                        <img src={game.IsPinned ? `/public/push-pin-true.png` : `/public/push-pin-false.png`} className='game-pin-icon' alt="" />
                      </div>

                      <img src="/public/bin.png" className='game-bin-icon' alt="" onClick={() => removeEntry(game.GameId)}/>
                    </div>
                  </div>
              </>
            )
          })}
        </div>
        </>
      );
    } else if(!notFound) {
      return (
        <h1 className='list-error-header'>List is empty. Search for games to add them to the list.</h1>
      )
    } else {
      return <></>
    }
  }

  // Pin game entry to list in database
  const pinEntry = async (entryId: number, pinState: boolean): Promise<void> => {
    await pinGame(sluggedName, Number(listId), entryId, !pinState);
    getData(Number(listId), sluggedName);
  } 

  // Delete game entry from list in database
  const removeEntry = async (gameId: number): Promise<void> => {
      if(confirm('Are you sure you want to delete this entry?')) {
        await removeGame(sluggedName, Number(listId), gameId);
        getData(Number(listId), sluggedName);
      }
  }

  // Get list data and name
  useEffect(() => {
    getData(Number(listId), sluggedName);
  }, []);

  return(
    <>
      {/* Header */}
      <Header></Header>

      <h1 className='list-header'>{listName}</h1>

      {/* Error message */}
      {notFound && <h1 className='list-error-header'>Error: <br></br> Page not found</h1>}

      {/* Display results */}
      {!isLoading && displayResults()}
    </>
  )
}

export default List