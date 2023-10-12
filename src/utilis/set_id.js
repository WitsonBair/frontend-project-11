import { uniqueId } from 'lodash';

export default (rssSource, posts) => {
  rssSource.id = uniqueId();

  const lists = posts.map((post) => Object.assign(post, {
    rssId: rssSource.id,
    postId: uniqueId(),
  }));

  return lists;
};
