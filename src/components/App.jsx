import { React, Component } from 'react';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Loader from './Loader/Loader';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import { fetchImages } from './api/Api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
export class App extends Component {
  state = {
    page: 1,
    q: '',

    per_page: 12,
    images: [],
    isLoading: false,
    loadMore: false,
  };

  createLightbox = () => {
    const lightbox = new SimpleLightbox('.gallery', {
      captionType: 'attr',
      captionsData: 'alt',
      captionPosition: 'bottom',
      captionDelay: 250,
    });

    return lightbox;
  };

  componentDidUpdate() {
    this.createLightbox();
  }

  onInputValue = e => {
    this.setState({
      q: e.target.value.trim(),
    });
  };

  onSubmitForm = async e => {
    e.preventDefault();

    try {
      if (this.state.page !== 1) {
        await this.setState({ page: 1 });
      }

      this.setState({ isLoading: true });

      const data = await fetchImages(
        this.state.q,
        this.state.per_page,
        this.state.page
      );

      console.log(data);

      if (data.totalHits === 0) {
        Notify.failure('We dont have any photos that match your request.');
      }

      if (data.totalHits > 12) {
        this.setState({ loadMore: true });
      } else {
        this.setState({ loadMore: false });
      }
      this.setState({ images: data.hits });
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onLoadMoreBnt = async e => {
    //console.log(e.target);

    try {
      await this.setState(prevState => ({
        isLoading: true,
        page: prevState.page + 1,
      }));
      const data = await fetchImages(
        this.state.q,
        this.state.per_page,
        this.state.page
      );

      this.setState(prevState => ({
        images: [...prevState.images, ...data.hits],
      }));
      if (data.totalHits <= 12) {
        this.setState({ loadMore: false });
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    return (
      <div>
        <Searchbar
          value={this.state.q}
          onSubmit={this.onSubmitForm}
          onChange={this.onInputValue}
        />
        <ImageGallery images={this.state.images} />
        {this.state.isLoading && <Loader />}
        {this.state.loadMore && !this.state.isLoading && (
          <Button onClick={this.onLoadMoreBnt} />
        )}
      </div>
    );
  }
}
