// Packages
import {useState, useEffect} from 'react'

// Types
import type {GameData, ListNames} from '../../../project-types.ts'

type AddGameProps = {
  gameId: number
  gameName: string | undefined
  gameData: GameData
}

// Functions
import {getListNames, addGame, removeGame} from '../db-utils.ts'

function AddGame(props: AddGameProps) {
  // Stores list names
  const [lists, setLists] = useState<ListNames[]>([]);

  // Tracks if menu should be visible or hidden
  const [showListMenu, setShowListMenu] = useState<boolean>(false);
  
  // Toggles list menu
  function toggleListMenu(): void {
    setShowListMenu(prevState => !prevState);
  }

  // Adds or removes the game from the list that was clicked
  const addOrRemove = async (listName: string, listId: number, gameExists: boolean):Promise<void> =>{
    // Change value of gameExists in that list
    setLists(prevLists =>
      prevLists.map(list =>
        list.ListId === listId
          ? { ...list, GameExists: !gameExists }
          : list
      )
    );

    if (gameExists) {
      removeGame(listName, listId, props.gameData.id);
    } else {
      addGame(listName, listId, props.gameData, props.gameName);
    }
  }

  // Get user lists
  useEffect(() => {
    getListNames(props.gameId)
      .then((listRes: ListNames[]) => {
        setLists(
          listRes.map(list => ({
            ...list,

            // Convert GameExist values from 0/1 to Booleans
            GameExists: Boolean(list.GameExists),
          }))
        );
      })
      .catch(() => {
        setLists([]);
      });
  }, []);


  return(
    <>
      {/* Add game button */}
      <div className='add-game-button info-container' onClick={toggleListMenu}>
        <span className='add-game-text'>Add to lists</span>
        <img src="/public/add.png" alt="" className='add-img'/>
      </div>

      {/* List menu */}
      {showListMenu && <div className='list-menu info-container'>
        {lists.map((list, _) => {
          return(
            <>
              <div className='list-menu-entry'>
                <span>{list.ListName}</span>

                <input type="checkbox" className='list-menu-checkbox' checked={Boolean(list.GameExists)}
                onChange={() => addOrRemove(list.SluggedName, list.ListId, Boolean(list.GameExists))}/>
              </div>
            </>
          )
        })}
      </div>}
    </>
  )
}

export default AddGame