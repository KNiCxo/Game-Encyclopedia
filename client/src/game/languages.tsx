// Typsetting for props
type LanguagesProps = {
    language_supports: {
    id: number,
    language: {
      id: number,
      name: string
    },
    language_support_type: {
      id: number,
      name: string
    }
  }[],
}

function Languages(props: LanguagesProps) {
  // Group support types with their respective language
  const groupLanguages = props.language_supports.reduce<Record<string, string[]>>((acc, item) => {
    // Get language name
    const language = item.language.name;

    // If language isn't in object, then add language
    if (!acc[language]) acc[language] = [];

    // Push language support type into respective array
    acc[language].push(item.language_support_type.name);

    return acc;
  }, {});

  return(
    <>
      {props.language_supports && <div className='languages-container info-container'>
            {/* Header */}
            <span className='container-header'>Supported Languages</span>

            {/* Iterate through languages */}
            {Object.entries(groupLanguages).map(([language, type]) => {
              return(
                <>
                  {/* Entry */}
                  <div className='language-entry'>
                    <span>{language}:</span>
                    <span className='support-type'> {type.join(', ')}</span>
                  </div>
                </>
              )
            })}
      </div>}
    </>
  )
}

export default Languages