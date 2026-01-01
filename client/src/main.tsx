import {createRoot} from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

import './styles/main.css';

// Import pages
import Home from './home.tsx'
import Top100 from './top100.tsx'
import ComingSoon from './coming-soon.tsx'
import MyLists from './my-lists.tsx'
import List from './list.tsx'
import SearchResults from './search-results.tsx'
import Game from './game/game.tsx'

const router = createBrowserRouter([
 {
  // Home Page
  path: '/',
  element: <Home></Home>
 },
{
  // Top 100
  path: '/top100',
  element: <Top100></Top100>
 },
 {
  // Coming Soon
  path: '/coming_soon',
  element: <ComingSoon></ComingSoon>
 },
 {
  // My Lists
  path: 'my_lists',
  element: <MyLists></MyLists>
 },
 {
  path: 'list/:listId',
  element: <List></List>
 },
 {
  // Search Results
  path: '/search/:gameName',
  element: <SearchResults></SearchResults>
 },
 {
   // Game Profile
  path: '/games/:gameId/:gameName',
  element: <Game></Game>
 }
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router}></RouterProvider>
)