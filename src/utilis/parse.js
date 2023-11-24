export default (data) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(data, 'text/xml');
  const errorNode = xml.querySelector('parsererror');

  if (errorNode) {
    const error = new Error(errorNode.textContent);
    error.isParsingError = true;
    throw error;
  }
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
      title,
      description,
    },
    posts,
  };

  return parsedData;
};
