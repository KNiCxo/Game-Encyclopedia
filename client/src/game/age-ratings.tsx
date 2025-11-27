// Typesetting for props
type AgeRatingsProps = {
  age_ratings: {
    id: number, 
    organization: {id: number, name: string}, 
    rating_category: {id: number, rating: string}
  }[]
}

// Component that contains age ratings
function AgeRatings(props: AgeRatingsProps) {
  return(
    <>
      {/* Age Ratings header */}
      <span className='age-ratings-header game-info-header'>Age Ratings</span>

      {/* Displays if content doesn't exist */}
      {!props.age_ratings && <span className='data-not-found'>-</span>}

      {/* Age Ratings container */}
      <div className='age-ratings'>
        {/* Iterate through age ratings array if it exists */}
        {props.age_ratings?.map((entry, _) => {
          return(
            <>
              {/* Indiviual age rating */}
              <div className='age-rating'>
                {/* Age rating image */}
                <img src={`/age-rating/${entry.organization.name}/${entry.rating_category.rating}.png`} alt="" className={`${entry.organization.name}`}/>
              </div>
            </>
          );
        })}
      </div>
    </>
  )
}

export default AgeRatings