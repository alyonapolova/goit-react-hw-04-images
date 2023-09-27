import React, { useState, useEffect } from 'react';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Loader from './Loader/Loader';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import fetchImages from './api/Api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

function App() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    createLightbox();
  }, [images]);

  const createLightbox = () => {
    const lightbox = new SimpleLightbox('.gallery', {
      captionType: 'attr',
      captionsData: 'alt',
      captionPosition: 'bottom',
      captionDelay: 250,
    });
    return lightbox;
  };

  const queryHandler = q => {
    setQ(q);
  };

  const onSubmitForm = () => {
    setImages([]);
    setPage(1);
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchImages(q, page);
      if (data.hits) {
        setImages([...images, ...data.hits]);
        setPage(prevPage => prevPage + 1);
      }
      if (data.totalHits === 0) {
        Notify.failure('We dont have any photos that match your request.');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onLoadMoreBtn = () => fetchData();

  useEffect(() => {
    if (q === '') return;
    fetchData();
  }, [q]);

  return (
    <div>
      <Searchbar setQ={queryHandler} onHandleForm={onSubmitForm} />
      <ImageGallery images={images} />
      {isLoading && <Loader />}
      {images.length > 11 && <Button onClick={onLoadMoreBtn} />}
    </div>
  );
}

export default App;
