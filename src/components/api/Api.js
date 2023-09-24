import axios from 'axios';

const apiURL = 'https://pixabay.com/api/';
const apiKey = '38646134-f0d35baa377bc06e37b81532c';

export const fetchImages = async (q, per_page, page) => {
  const response = await axios.get(apiURL, {
    params: {
      key: apiKey,
      q,
      per_page,
      page,
      safesearch: true,
      image_type: 'photo',
      orientation: 'horizontal',
    },
  });
  return response.data;
};
