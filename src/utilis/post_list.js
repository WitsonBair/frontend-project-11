import getData from './get_data.js';
import parse from './parse.js';
import setId from './set_id.js';

export default async (link, watchState) => getData(link)
  .then((data) => new DOMParser().parseFromString(data, 'text/xml'))
  .then((xml) => {
    const { rssSource, posts } = parse(xml, link);
    const list = setId(rssSource, posts);
    watchState.rssList.unshift(rssSource);
    watchState.postList.unshift(...list);
    watchState.form.processState = 'success';
    watchState.form.processState = 'filling';
  })
  .catch((error) => {
    watchState.form.errors = { error };
    watchState.list.pop();
  });
