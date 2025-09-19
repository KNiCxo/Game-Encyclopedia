import {createRoot} from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

import './styles/main.css';

// Import pages
import Home from './home.tsx'
import SearchResults from './search-results.tsx'
import Game from './game.tsx'

const router = createBrowserRouter([
 {
    // Home Page
    path: '/',
    element: <Home></Home>
 },
 {
  // Search Results Page
  path: '/search/:gameName',
  element: <SearchResults></SearchResults>
 },

 // Game Profile Page
 {
  path: '/games/:gameId',
  element: <Game></Game>
 }
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router}></RouterProvider>
)