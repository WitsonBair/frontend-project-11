import getData from './get_data.js';
import parse from './parse.js';
import setId from './set_id.js';

export default async (link, watchState) => getData(link)
  .then((data) => {
    const { rssSource, posts } = parse(data);
    rssSource.url = link;
    const list = setId(rssSource, posts);
    watchState.rssList.unshift(rssSource);
    watchState.postList.unshift(...list);
    watchState.form.processState = 'success';
    watchState.form.processState = 'filling';
  })
  .catch((error) => {
    watchState.form.error = error;
    watchState.list.pop();
  });
