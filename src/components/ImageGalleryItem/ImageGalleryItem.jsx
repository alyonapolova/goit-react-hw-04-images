import React from 'react';

const ImageGalleryItem = ({ image }) => {
  return (
    <a href={image.largeImageURL} className="gallery">
      <img src={image.webformatURL} alt={image.name} />
    </a>
  );
};

export default ImageGalleryItem;
