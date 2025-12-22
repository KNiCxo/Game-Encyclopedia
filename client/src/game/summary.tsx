// Import packages 
import {useState} from 'react'

// Typesetting for props
type SummaryProps = {
  summary: string
}

// Component that contains the game summary
function Summary(props: SummaryProps) {
  // Track if summary is extended
  const [isExtended, setIsExtended] = useState<boolean>(false);

  // Divies summary into two parts
  let initialSummary: string = props.summary?.substring(0, 200);
  let extendedSummary: string = props.summary?.substring(200);

  return(
    <>
      {props.summary && <div className='summary-container info-container'>
        <span className='container-header'>Summary</span>

        <div className='summary'>
          <span>{initialSummary}</span>
          {(props.summary.length > 200 && !isExtended) && <span className='dots'>...&nbsp;</span>}
          {isExtended && <span>{extendedSummary + ' '}</span>}
          {props.summary.length > 200 && <span className='more-button' onClick={() => setIsExtended(prev => !prev)}>{isExtended ? 'Less' : 'More'}</span>}
        </div>
       </div>}
    </>
  )
}

export default Summary