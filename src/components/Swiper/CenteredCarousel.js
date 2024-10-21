// src/CenteredCarousel.js
import React, { useState, useEffect } from 'react';
import './CenteredCarousel.css';
import Img1 from './SwiperImgs/abby-rurenko-uOYak90r4L0-unsplash.jpg'
import Img2 from './SwiperImgs/abinash-satapathy-rPZIDViMDCg-unsplash.jpg'
import Img3 from './SwiperImgs/alex-vd-slikke-wbHQBKSagV8-unsplash.jpg'
import Img4 from './SwiperImgs/hoylee-song-7X5XwKNH_sg-unsplash.jpg'
import Img5 from './SwiperImgs/hugo-richard-S7bDOVuF4R8-unsplash.jpg'
import Img6 from './SwiperImgs/joseph-reece-kcNha9s-NTA-unsplash.jpg'
import Img8 from './SwiperImgs/jessica-furtney-YOoucEImrKw-unsplash.jpg'
import Img9 from './SwiperImgs/leslie-cross-NW6bji6tk1s-unsplash.jpg'
import Img10 from './SwiperImgs/sanju-pandita-S-7g_8S8cec-unsplash.jpg'
import Img11 from './SwiperImgs/stefano-bucciarelli-Oo_GSNAtF20-unsplash.jpg'
import Img12 from './SwiperImgs/nomadic-julien-zbfJVugoFeM-unsplash.jpg'


const CenteredCarousel = ({ interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesToShow = 1; // Number of slides visible at once

  const images =[

    Img1,
    Img2,
    Img3,
    Img4,
    Img5,
    Img6,
    Img8,
    Img9,
    Img10,
    Img11,
    Img12,
    


  ]

  // Automatically move to the next slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const getSlideClass = (index) => {
    if (index === currentIndex) return 'active';
    if (index === (currentIndex - 1 + images.length) % images.length) return 'prev';
    if (index === (currentIndex + 1) % images.length) return 'next';
    return '';
  };

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        {images.map((image, index) => (
          <div
            key={index}
            className={`carousel-slide ${getSlideClass(index)}`}
            style={{ transform: `translateX(${-(currentIndex - Math.floor(slidesToShow / 2)) * 100 / slidesToShow}%)` }}
          >
            <img src={image} alt={`Slide ${index}`} />
          </div>
        ))}
      </div>
      <div className="carousel-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default CenteredCarousel;
