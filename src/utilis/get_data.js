import axios from 'axios';

export default async (url) => {
  const rssData = axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then((response) => response.data.contents) // if (response.ok) return response.json();
    .catch((err) => {
      const error = new Error(err.message);
      error.isNetworkError = true;
      throw error;
    });

  return rssData;
};

// fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
/* response.json() */
