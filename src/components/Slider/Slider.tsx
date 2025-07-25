import React, { useState } from "react";
import "./Slider.scss";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import type { Gallery } from "../../graphql/types/product.types";

interface SliderProps {
  images: Gallery[];
}

const Slider: React.FC<SliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    const lastIndex = images.length - 1;
    setCurrentIndex(currentIndex === lastIndex ? 0 : currentIndex + 1);
  };

  const prevSlide = () => {
    const lastIndex = images.length - 1;
    setCurrentIndex(currentIndex === 0 ? lastIndex : currentIndex - 1);
  };

  return (
    <div className="slider-container">
      <div className="images-container">
        {images.map((image, index) => (
          <img
            key={index}
            loading="lazy"
            src={image.image_url}
            alt="slide"
            onClick={() => setCurrentIndex(index)}
            className={index === currentIndex ? "active" : "inactive"}
          />
        ))}
      </div>
      <div className="single-img">
        <img
          src={images[currentIndex].image_url}
          alt="main"
          loading="lazy"
          style={{ width: "100%", maxHeight: "100%" }}
        />
        <div className="img-arrows">
          <IoIosArrowBack
            style={{
              padding: 5,
              background: "#000000BA",
              height: 32,
              width: 32,
            }}
            onClick={prevSlide}
          />
          <IoIosArrowForward
            style={{
              padding: 5,
              background: "#000000BA",
              height: 32,
              width: 32,
            }}
            onClick={nextSlide}
          />
        </div>
      </div>
    </div>
  );
};

export default Slider;
