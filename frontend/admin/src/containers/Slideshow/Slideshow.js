import './Slideshow.css'
import React, { useState,useEffect,useRef } from 'react';
import API from '../utils/request';
import { APPCONFIG } from '../utils/constants';

function Slideshow() {
    const [index, setIndex] = useState(0);
    const timeoutRef = useRef(null);
    const [slide, setSlide] = useState([]);
    const delay = 5500;

    useEffect(() => {
      API.get('/api/public/home/slide')
            .then((res) =>{
              const images = [];
              console.log(res.data);
              res.data.forEach(element => {
                images.push(APPCONFIG.BASE_URL_IMAGE_SLIDE+element);
              });
              console.log(images);
              setSlide(images);
            })
            .catch((error)=>{
                console.log(error);
        });
    }, [])
  
    function resetTimeout() {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  
    useEffect(() => {
      resetTimeout();
      timeoutRef.current = setTimeout(
        () =>
          setIndex((prevIndex) =>
            prevIndex === slide.length - 1 ? 0 : prevIndex + 1
          ),
        delay
      );
  
      return () => {
        resetTimeout();
      };
    }, [index]);
  
    return (
      <div className="slideshow" style={{color: 'black'}}>
        <div
          className="slideshowSlider"
          style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
        >
          {slide.map((backgroundImage, index) => (
            <div
              className="slide"
              key={index}
              style={{ 
                backgroundImage: `url(${slide[index]})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100%'
              }}
            ></div>
          ))}
        </div>
  
        <div className="slideshowDots">
          {slide.map((_, idx) => (
            <div
              key={idx}
              className={`slideshowDot${index === idx ? " active" : ""}`}
              onClick={() => {
                setIndex(idx);
              }}
            ></div>
          ))}
        </div>
      </div>
    );
}

export default Slideshow;

