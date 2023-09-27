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
  const [per_page] = useState(12);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);

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

  const onInputValue = e => {
    setQ(e.target.value.trim());
    setPage(1);
  };

  const onSubmitForm = async e => {
    e.preventDefault();

    try {
      //setPage(1);
      setIsLoading(true);

      const data = await fetchImages(q, per_page, page);
      setImages(data.hits);
      console.log(data);
      if (data.totalHits === 0) {
        Notify.failure('We dont have any photos that match your request.');
      }

      if (data.totalHits > 12) {
        setLoadMore(true);
      } else {
        setLoadMore(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onLoadMoreBnt = async () => {
    try {
      setIsLoading(true);
      setPage(prevPage => prevPage + 1);

      const data = await fetchImages(q, per_page, page + 1);

      setImages(prevImages => [...prevImages, ...data.hits]);

      if (data.totalHits <= 12) {
        setLoadMore(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Searchbar value={q} onSubmit={onSubmitForm} onChange={onInputValue} />
      <ImageGallery images={images} />
      {isLoading && <Loader />}
      {loadMore && !isLoading && <Button onClick={onLoadMoreBnt} />}
    </div>
  );
}

export default App;
