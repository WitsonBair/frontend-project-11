export default async (url) => {
  const rssData = fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then((response) => {
      if (response.ok) return response.json();
    })
    .then((data) => data.contents)
    .catch((err) => {
      const error = new Error(err.message);
      error.isNetworkError = true;
      throw error;
    });

  return rssData;
};
