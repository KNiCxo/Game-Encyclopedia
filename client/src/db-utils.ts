// Import types
import type {GameData, ListTable, ListData, ListNames} from '../../project-types.ts';

// Gets all lists and their data from database
export const getLists = async (): Promise<ListTable[]>  => {
  try {
    const response = await fetch('http://localhost:4001/getLists');
    const json = await response.json();
    return (json);
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Gets the name from a single list from database
export const getListName = async (listId: number): Promise<string>  => {
  try {
    const response = await fetch(`http://localhost:4001/getListName/${listId}`);
    const json = await response.json();
    return (json);
  } catch (error) {
    console.log(error);
    return '';
  }
}

// Gets all tables from database
export const getListNames = async (gameId: number): Promise<ListNames[]>  => {
  try {
    const response = await fetch(`http://localhost:4001/getListNames/${gameId}`);
    const json = await response.json();
    return (json);
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Get data for a specific list
export const getListData = async (listId: number, listName: string | undefined): Promise<ListData[]> => {
    try {
    const response = await fetch(`http://localhost:4001/getListData/${listId}/${listName}`);
    const json = await response.json();
    return (json);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Update pin state from a game in a list
export const updateListName = async (listName: string | undefined, listId: string | undefined, newName: string): Promise<void> => {
    try {
      await fetch(`http://localhost:4001/updateListName`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listName: listName,
          listId: listId,
          newName: newName
        })
      });
  } catch (error) {
      console.log(error);
    throw error;
  }
}

// Update pin state from a game in a list
export const pinGame = async (listName: string | undefined, listId: number, entryId: number, pinState: boolean): Promise<void> => {
    try {
      await fetch(`http://localhost:4001/pinGame`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listName: `${listName}_${listId}`,
          listId: listId,
          entryId: entryId,
          pinState: pinState
        })
      });
  } catch (error) {
      console.log(error);
    throw error;
  }
}

// Create list entry in database
export const createEntry = async (name: string): Promise<void> => {
  try {
    await fetch(`http://localhost:4001/createEntry/${name}`, {
      method: 'POST'
    });
  } catch (error) {
    console.log(error);
  }
}

// Adds game to list and updates list_table
export const addGame = async (listName: string, listId: number, gameData: GameData, gameName: string | undefined): Promise<void> => {
  // Get year from date
  const date: Date = new Date(gameData.first_release_date * 1000);
  const year: number = date.getFullYear();

  // Remove copies of platforms in array
  const reducedReleaseDates = gameData.release_dates?.reduce<Record<string, {human: string, date: number}>>((acc, item) => {
    // Get platform name
    const platform:string = item.platform.name;

    // If platform isn't in object, then add platform
    if (!acc[platform]) {
      // Add human and date data to platform property
      acc[platform] = {human: item.human, date: item.date,}
    } else {
      // If date stored in platform property is larger than the date 
      // in the current iteration, then update the platform property
      if (acc[platform].date > item.date) {
        acc[platform] = {human: item.human, date: item.date}
      }
    }

    return acc;
  }, {});

  let platformString: string = '';

  // Stores list of platforms that the game exists on
  Object.entries(reducedReleaseDates).forEach((platform, index) => {
    platformString += platform[0]

    // Add comma to all elements except the last
    if (index < Object.entries(reducedReleaseDates).length - 1) {
      platformString += ', ';
    }
  });
  
  try {
    await fetch(`http://localhost:4001/addGame`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        listName: `${listName}_${listId}`,
        listId: listId,
        gameId: gameData.id,
        cover: gameData.cover.image_id,
        name: gameData.name,
        year: year,
        platforms: platformString,
        sluggedName: gameName
      })
    });
  } catch (error) {
    console.log(error);
  }
}

// Delete list entry from database
export const deleteEntry = async (name: string, id: number): Promise<void> => {
  try {
    await fetch(`http://localhost:4001/deleteEntry/${name}/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.log(error);
  }
}

// Removes game from list and updates list_table
export const removeGame = async (listName: string | undefined, listId: number, gameId: number): Promise<void> => {
  try {
    await fetch(`http://localhost:4001/removeGame`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        listName: `${listName}_${listId}`,
        listId: listId,
        gameId: gameId,
      })
    });
  } catch (error) {
    console.log(error);
  }
}
