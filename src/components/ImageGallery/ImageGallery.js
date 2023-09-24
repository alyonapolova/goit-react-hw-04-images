import React from 'react';
import ImageGalleryItem from 'components/ImageGalleryItem/ImageGalleryItem';
import css from './ImageGallery.module.css';

const ImageGallery = ({ images }) => {
  return (
    <div className={css.galleryList}>
      {images.map(image => (
        <ImageGalleryItem key={image.id} image={image} />
      ))}
    </div>
  );
};

export default ImageGallery;
