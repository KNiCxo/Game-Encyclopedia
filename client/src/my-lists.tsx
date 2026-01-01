// Packages
import {useState, useEffect, type JSX} from 'react'
import {Link} from 'react-router-dom'

// Styling
import './styles/my-lists.css'

// Types
import type {ListTable} from '../../project-types.ts';

// Import page components and functions */
import Header from './header/header.tsx'
import {getLists, createEntry, deleteEntry} from './db-utils.ts'

function MyLists() {
  // Stores game lists
  const [lists, setLists] = useState<ListTable[]>([]);

  // Checks to see if add list element is enabled
  const [addListEnabled, setAddListEnabled] = useState<boolean>(false);

  // Gets names of lists
  const storeLists = (): void => {
    getLists()
    .then((listRes: ListTable[]) => {
      setLists(listRes);
    })
    .catch(() => {
      setLists([]);
    });
  }

  // Display list entries
  const displayResults = (): JSX.Element => {
    return(
      <>
        <div className='list-entries'>
          {lists.map((lists, _) => {
            return(
              <>
                {/* Entry */}
                <div className='list-entry'>
                  {/* Pinned games */}
                  <div className='pinned-games'>
                    <div className='pinned-game'>
                      <img src={
                        lists.PinnedGameURL1
                        ? `https://images.igdb.com/igdb/image/upload/t_1080p/${lists.PinnedGameURL1}.jpg`
                        : '/public/no-cover.png'
                      } 
                        alt="" className='pinned-game-img'/>
                    </div>

                    <div className='pinned-game'>
                      <img src={
                        lists.PinnedGameURL2
                        ? `https://images.igdb.com/igdb/image/upload/t_1080p/${lists.PinnedGameURL2}.jpg`
                        : '/public/no-cover.png'
                      } 
                        alt="" className='pinned-game-img'/>
                    </div>
                    
                    <div className='pinned-game'>
                      <img src={
                        lists.PinnedGameURL3
                        ? `https://images.igdb.com/igdb/image/upload/t_1080p/${lists.PinnedGameURL3}.jpg`
                        : '/public/no-cover.png'
                      } 
                        alt="" className='pinned-game-img'/>
                    </div>

                    <div className='pinned-game'>
                      <img src={
                        lists.PinnedGameURL4
                        ? `https://images.igdb.com/igdb/image/upload/t_1080p/${lists.PinnedGameURL4}.jpg`
                        : '/public/no-cover.png'
                      } 
                        alt="" className='pinned-game-img'/>
                    </div>
                  </div>
                  
                  {/* Title, game count, and delete button */}
                  <div className='list-info'>
                    <Link to={`/list/${lists.ListId}`} className='link'><span className='list-title'>{lists.ListName}</span></Link>
                
                    <div className='list-info-bottom'>
                      <span className='list-count'>{lists.GameCount} Games</span>
                      <img src="/public/bin.png" alt="" className='list-delete' onClick={() => removeEntry(lists.SluggedName, lists.ListId)}/>
                    </div>
                  </div>
                </div>
              </>
            )
          })}
        </div>
      </>
    );
  }

  // Toggle add list element
  const toggleAddList = (): void => {
    const element = document.querySelector<HTMLElement>('.create-list');
    
    // If element is not null then toggle style
    if (element) {
      element.style.display = window.getComputedStyle(element).display === 'none' ? 'flex' : 'none';
      setAddListEnabled(prev => !prev);
    }
  }

  // Create new list entry and send to database;
  const newEntry = async (): Promise<void> => {
    const input = document.querySelector('.create-list-input') as HTMLInputElement | null;
    let name;

    if (input && input.value !== '') {
      name = input.value;
    } else {
      return;
    }

    await createEntry(name);
    toggleAddList();
    storeLists();
  }

  // Delete list entry from database
  const removeEntry = async (name: string, id: number): Promise<void> => {
     if(confirm('Are you sure you want to delete this list?')) {
      await deleteEntry(name, id);
      storeLists();
     }
  }

  // Get lists on component mount
  useEffect(() => {
    storeLists();
  }, [])

  return(
    <>
      {/* Header */}
      <Header></Header>

      {/* New list button */}
      <button className='new-list-button'onClick={() => {if(!addListEnabled) toggleAddList()}}>Create new list</button>

      {/* Create list element */}
      <div className='create-list'>
        {/* Input field */}
        <div className='create-list-input-container'>
          <input type="text" className='create-list-input' placeholder='Name your list'/>
        </div>

        {/* Add and cancel buttons */}
        <div className='create-list-buttons'>
          <button className='create-list-add' onClick={newEntry}>Add</button>
          <button className='create-list-cancel' onClick={toggleAddList}>Cancel</button>
        </div>
      </div>

      {/* Display results from database */}
      {displayResults()}
    </>
  )
}

export default MyLists