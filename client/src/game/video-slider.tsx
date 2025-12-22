// Import packages
import {useState, useRef, useEffect, type Dispatch, type SetStateAction} from 'react'

// Typesetting for props
type SliderProps = {
  videos: {
    id: number,
    video_id: string
  }[],
  setIsLoaded: Dispatch<SetStateAction<boolean>>
}

// Video slider component for game page Youtube videos
function VideoSlider(props: SliderProps) {
  // Tracks videos that are loaded
  const [loadCount, setLoadCount] = useState<number>(0);

  // Tracks position in image array
  const [imgIndex, setImgIndex] = useState<number>(0);

  // Reference to left and right arrow
  const leftArrow = useRef<HTMLImageElement | null>(null);
  const rightArrow = useRef<HTMLImageElement| null>(null);

  // Displays next image in array
  function showNextImg(): void {
    const arrayLength: number = props.videos.length;

    // If within bounds, go to next image
    if (imgIndex < arrayLength - 1) {
      setImgIndex(s => s + 1);

      // Show left arrow if not on the first image
      // or hide right arrow if at the end of gallery
      if (imgIndex == 0) {
        if (leftArrow.current) leftArrow.current.style.display = 'block';
      } else if (imgIndex == arrayLength - 2) {
        if (rightArrow.current) rightArrow.current.style.display = 'none';
      }
    }
  }

  // Displays previous image in array
  function showPrevImg(): void {
    const arrayLength: number = props.videos.length;

    // If within bounds, go to previous image
    if (imgIndex > 0) {
      setImgIndex(s => s - 1);

      // Hide left arrow if at the first image
      // or show right arrow if not at end of gallery
      if (imgIndex == 1) {
        if (leftArrow.current) leftArrow.current.style.display = 'none';
      } else if (imgIndex == arrayLength - 1) {
        if (rightArrow.current) rightArrow.current.style.display = 'block';
      }
    }
  }

  // If all videos have loaded, set isLoaded to true
  useEffect(() => {
    if (loadCount == props.videos.length) props.setIsLoaded(true);
  }, [loadCount])

  return (
    <> 
      {/* Slider Container */}
      {props.videos && <div className='slider-container'>
        <div className='gallery-container'>
          {props.videos.map((video) => {
            return(
              <iframe src={`https://www.youtube.com/embed/${video.video_id}`}
              key={video.video_id}
                style={{
                  border: "none",
                  translate: `${-100 * imgIndex}%`
                }}
                width='100%'
                height="185"
                onLoad={() => setLoadCount(c => c + 1)}
              ></iframe>
            )
          })}
        </div>

        {/* Arrow Buttons */}
        {props.videos.length > 1 && <img onClick={showPrevImg} className='arrow-button' ref={leftArrow} src="/public/arrow.png" alt="" style={{left: 10, display: 'none'}}/>}
        {props.videos.length > 1 && <img onClick={showNextImg} className='arrow-button right-arrow' ref={rightArrow} src="/public/arrow.png" alt="" style={{right: 10}}/>}
      </div>}
    </>
  )
}

export default VideoSlider