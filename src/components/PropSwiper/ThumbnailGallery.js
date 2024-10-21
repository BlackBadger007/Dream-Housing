import React, { useState } from 'react';
import './ThumbnailGallery.css'; // Import the CSS file for styling
import Img1 from './PropImgs/abby-rurenko-uOYak90r4L0-unsplash.jpg'
import Img2 from './PropImgs/hugo-richard-S7bDOVuF4R8-unsplash.jpg'
import Img3 from './PropImgs/istockphoto-1144324574-1024x1024.jpg'
import Img4 from './PropImgs/istockphoto-1150545984-1024x1024.jpg'
import Img5 from './PropImgs/istockphoto-1221865611-1024x1024.jpg'
import Img6 from './PropImgs/istockphoto-1221865626-1024x1024.jpg'
import Img7 from './PropImgs/istockphoto-1271131642-1024x1024.jpg'
import Img8 from './PropImgs/istockphoto-2077978698-1024x1024.jpg'
import Img9 from './PropImgs/istockphoto-503044702-1024x1024.jpg'
import Img10 from './PropImgs/jessica-furtney-YOoucEImrKw-unsplash.jpg'
import Img11 from './PropImgs/stefano-bucciarelli-Oo_GSNAtF20-unsplash (1).jpg'


const ThumbnailGallery = ({images}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // const images =[

    //     Img1,
    //     Img2,
    //     Img3,
    //     Img4,
    //     Img5,
    //     Img6,
    //     Img7,
    //     Img8,
    //     Img9,
    //     Img10,
    //     Img11,


    //   ]

    // console.log(images)

    const handleThumbnailClick = (index) => {
        setCurrentIndex(index);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
    };

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
    };

    return (
        <div className="gallery-container">
            <div className="main-image">
                <img src={images[currentIndex]} alt="Main" />
            </div>
            <div className="thumbnail-wrapper">
                <button className="prev" onClick={prevImage}>&#10094;</button>
                <div className="thumbnail-gallery">
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => handleThumbnailClick(index)}
                        />
                    ))}
                </div>
                <button className="next" onClick={nextImage}>&#10095;</button>
            </div>
        </div>
    );
};

export default ThumbnailGallery;
