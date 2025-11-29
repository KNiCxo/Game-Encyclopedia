
import {useState, useEffect, type JSX} from 'react'
import {Link} from 'react-router-dom'
import slugify from 'slugify'

// Import styles
import './styles/coming-soon.css'

// Import types
import type {ComingSoonResults} from '../../project-types.ts'

// Import components and functions
import Header from './header/header.tsx'
import {getComingSoon} from './search-utils.ts'

function ComingSoon() {
  const [comingSoonData, setComingSoonData] = useState<ComingSoonResults[]>([]);

  // Displays Coming Soon results
  function displayResults():JSX.Element {
      if (comingSoonData.length > 0) {
        return(
          <>
            <div className='coming-soon-results'>
              {comingSoonData.map((entry) => {
                const slugGameName = slugify(entry.name, {
                  lower: true,
                  replacement: '_',
                  strict: true
                });

                return(
                  <>
                    <Link to={`/games/${entry.id}/${slugGameName}`} className='link'>
                      <div className='coming-soon-card'>
                        <img src={`https://images.igdb.com/igdb/image/upload/t_1080p/${entry.cover.image_id}.jpg`} alt="" />
                        
                        <div className='coming-soon-title'>
                          <p>{entry.name}</p>
                        </div>
                      </div>
                    </Link>
                  </>
                )
              })}
            </div>
          </>
        )
    } else {
      return(<div className='loader'></div>);
    }
  }

  // Get coming soon releases on component mount
  useEffect(() => {
    getComingSoon().then((data) => {
      setComingSoonData(data);
    });
  }, []);

  return(
    <>
      {/* Header */}
      <Header></Header>

      <h1 className='coming-soon-header'>Highly Anticipated Games Coming Soon</h1>

      {displayResults()}
    </>
  )
}

export default ComingSoon