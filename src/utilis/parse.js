export default (xml, url) => {
  const title = xml.querySelector('title').textContent;
  const description = xml.querySelector('description').textContent;

  const items = [...xml.querySelectorAll('item')];

  const posts = items.map((item) => ({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
  }));

  const parsedData = {
    rssSource: {
      url,
      title,
      description,
    },
    posts,
  };

  return parsedData;
};
