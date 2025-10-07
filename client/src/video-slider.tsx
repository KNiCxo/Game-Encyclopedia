import {useState, useRef} from 'react'

import './styles/video-slider.css'

type video = {
  id: number,
  video_id: string
}

interface sliderProps {
  videos: video[]
}

function VideoSlider(props: sliderProps) {
  // Tracks position in image array
  const [imgIndex, setImgIndex] = useState(0);

  // Reference to left and right arrow
  const leftArrow = useRef<HTMLImageElement | null>(null);
  const rightArrow = useRef<HTMLImageElement| null>(null);

  // Displays next image in array
  function showNextImg() {
    const arrayLength = props.videos.length;

    // If within bounds, go to next image
    if (imgIndex < arrayLength) {
      setImgIndex(s => s + 1);
    }

    // Show left arrow if not on the first image
    // or hide right arrow if at the end of gallery
    if (imgIndex == 0) {
      if (leftArrow.current) leftArrow.current.style.display = 'block';
    } else if (imgIndex == 3) {
      if (rightArrow.current) rightArrow.current.style.display = 'none';
    }
  }

  // Displays previous image in array
  function showPrevImg() {
    // If within bounds, go to previous image
    if (imgIndex > 0) {
      setImgIndex(s => s - 1);
    }

    // Hide left arrow if at the first image
    // or show right arrow if not at end of gallery
    if (imgIndex == 1) {
      if (leftArrow.current) {
        leftArrow.current.style.display = 'none';
      }
    } else if (imgIndex == 4) {
      if (rightArrow.current) {
        rightArrow.current.style.display = 'block';
      }
    }
  }

  return (
    <> 
      {/* Slider Container */}
      <div className='slider-container'>
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
              ></iframe>
            )
          })}
        </div>

        {/* Arrow Buttons */}
        <img onClick={showPrevImg} className='arrow-button' ref={leftArrow} src="/public/arrow.png" alt="" style={{left: 10, display: 'none'}}/>
        <img onClick={showNextImg} className='arrow-button right-arrow' ref={rightArrow} src="/public/arrow.png" alt="" style={{right: 10}}/>
      </div>
    </>
  )
}

export default VideoSlider