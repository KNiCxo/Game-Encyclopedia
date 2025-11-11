// Typesetting for props
type ReleaseDatesProps = {
  release_dates: {
    id: number,
    date: number,
    human: string,
    platform: {
      id: number,
      name: string,
    }
  }[]
}

function ReleaseDates(props: ReleaseDatesProps) {
  // Gather earliest release dates per platform
  const reducedReleaseDates = props.release_dates.reduce<Record<string, {human: string, date: number}>>((acc, item) => {
    // Get platform name
    const platform = item.platform.name;

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

  console.log(reducedReleaseDates)
  return(
    <>
      {props.release_dates && <div className='release-dates-container info-container'>
        {/* Header */}
        <span className='container-header'>Release Dates</span>

        {Object.entries(reducedReleaseDates).map(([platform, releaseInfo]) => {
          return(
            <>
              {/* Entry */}
              <div className='release-dates-entry'>
                <span>{platform}: </span>
                <span className='release-dates-human'>{releaseInfo.human}</span>
              </div>
            </>
          )
        })}
      </div>}
    </>
  )
}

export default ReleaseDates