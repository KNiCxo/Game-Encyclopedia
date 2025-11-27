// Import packages
import {Link} from 'react-router-dom'

// Typesetting for props
type DropdownProps = {
  open: boolean,
  onClose: () => void
}

// Mobile dropdown menu
function Dropdown(props: DropdownProps) {
  return(
    <>
      {/* Mobile Dropdown */}     
      <div className='dropdown' style={{ transform: props.open ? 'translateX(0%)' : 'translateX(100%)' }}>
        <img onClick={props.onClose} src="/public/close.png" alt="" />
        <ul>
          <li>
            <Link to='/top100'className='link dropdown-link' onClick={props.onClose}>Top 100</Link>
          </li>
          <li>
            <Link to='/coming_soon'className='link dropdown-link' onClick={props.onClose}>Coming Soon</Link>
          </li>
          <li>
            <Link to='/'className='link dropdown-link' onClick={props.onClose}>Popular New Releases</Link>
          </li>
          <li>
            <Link to='/my_lists'className='link dropdown-link' onClick={props.onClose}>My Lists</Link>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Dropdown