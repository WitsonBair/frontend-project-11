export default async (url) => {
  const rssData = fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Network response was not ok.');
    })
    .then((data) => data.contents);

  return rssData;
};
