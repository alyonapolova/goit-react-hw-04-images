import { React, useEffect, useState } from 'react';
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

  const createLightbox = () => {
    const lightbox = new SimpleLightbox('.gallery', {
      captionType: 'attr',
      captionsData: 'alt',
      captionPosition: 'bottom',
      captionDelay: 250,
    });

    return lightbox;
  };

  // useEffect(() => {
  //   createLightbox();
  // }, []);

  // componentDidUpdate() {
  //   this.createLightbox();
  // }

  const onInputValue = e => {
    setQ(e.target.value.trim());
  };
  // onInputValue = e => {
  //   this.setState({
  //     q: e.target.value.trim(),
  //   });
  // };

  useEffect(() => {
    setIsLoading(true);

    fetchImages(q, per_page, page)
      .then(data => {
        console.log(data);
        if (data.totalHits === 0) {
          Notify.failure('We dont have any photos that match your request.');
        }
        if (data.totalHits > 12) {
          setLoadMore(true);
        } else {
          setLoadMore(false);
        }
        setImages(prevImages => [...prevImages, ...data.hits]);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [q, per_page, page]);

  const onSubmitForm = e => {
    e.preventDefault();
    if (page !== 1) {
      setPage(1);
    }
  };

  const onLoadMoreBnt = async e => {
    //console.log(e.target);
    try {
      setIsLoading(true);
      setPage(prevState => prevState + 1);
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

  // onLoadMoreBnt = async e => {
  //   //console.log(e.target);

  //   try {
  //     await this.setState(prevState => ({
  //       isLoading: true,
  //       page: prevState.page + 1,
  //     }));
  //     const data = await fetchImages(
  //       this.state.q,
  //       this.state.per_page,
  //       this.state.page
  //     );

  //     this.setState(prevState => ({
  //       images: [...prevState.images, ...data.hits],
  //     }));
  //     if (data.totalHits <= 12) {
  //       this.setState({ loadMore: false });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     this.setState({ isLoading: false });
  //   }
  // };

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
