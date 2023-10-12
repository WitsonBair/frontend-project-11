import { differenceBy, uniqueId } from 'lodash';
import getData from './get_data.js';
import parse from './parse.js';

const updateList = (watchState) => {
  const { rssList, postList } = watchState;

  const promises = rssList.map(({ id, url }) => getData(url)
    .then((data) => new DOMParser().parseFromString(data, 'text/xml'))
    .then((xml) => parse(xml, url))
    .then(({ posts }) => {
      const currentPosts = postList.filter((post) => post.rssId === id);
      const newPosts = posts.map((post) => ({ ...post, rssId: id, postId: uniqueId() }));
      const updatedPosts = differenceBy(newPosts, currentPosts, 'link');
      postList.unshift(...updatedPosts);
    })
    .catch((error) => {
      console.error(`Error: ${error}`);
    }));

  return Promise.all(promises).finally(() => setTimeout(updateList, 5000, watchState));
};

export default updateList;
