import './styles/header.css'

/* Project header */
function Header() {
  return(
    <>
      {/* Header */}
      <div className='header'>
        <div className='header-top'>
          {/* Logo */}
          <div className='header-logo'>
            <img className='header-logo' src="gamepad.png" alt="" />
            <h1>GAME ENCYCLOPEDIA</h1>
          </div>

          {/* List Link */}
          <img className='list-link' src="list.png" alt="" />
        </div>

        {/* Search Bar */}
        <div className='search-div'>
          <input className='search' type="text" placeholder='Search'/>
          <img className='search-icon' src="search.png" alt="" />
        </div>
      </div>
    </>
  )
}

export default Header