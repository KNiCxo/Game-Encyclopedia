// Import types
import type {ListTable} from '../../project-types.ts';

// Gets all tables from database
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
