import { React, useCallback, useEffect, useState } from 'react';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Loader from './Loader/Loader';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import fetchImages from './api/Api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const App = () => {
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
  };

  const onSubmitForm = useCallback(
    async e => {
      e.preventDefault();
      // console.log(e);

      try {
        setIsLoading(true);
        setPage(1);

        const data = await fetchImages(q, per_page, page);

        if (data.totalHits === 0) {
          Notify.failure('We dont have any photos that match your request.');
        }
        if (data.totalHits > 12) {
          setLoadMore(true);
        } else {
          setLoadMore(false);
        }
        setImages(data.hits);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [q, page, per_page]
  );

  useEffect(() => {
    onSubmitForm();
  }, [onSubmitForm, q]);

  const onLoadMoreBnt = async () => {
    try {
      await setIsLoading(true);
      await setPage(prevPage => prevPage + 1);
      console.log(page);
      const data = await fetchImages(q, per_page, page);

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
};
export default App;
