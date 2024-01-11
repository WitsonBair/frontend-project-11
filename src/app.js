import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import { differenceBy, uniqueId } from 'lodash';
import initView from './view.js';
import resources from './locales/index.js';
import parse from './parser.js';

const addProxy = (url) => {
  const proxyUrl = new URL('https://allorigins.hexlet.app/get');
  proxyUrl.searchParams.set('disableCache', true);
  proxyUrl.searchParams.set('url', url);
  return proxyUrl.toString();
};

const getProcessErrorCode = (error) => {
  if (error.isParsingError) {
    return 'errors.typeError';
  }
  if (error.isAxiosError) {
    return 'errors.noNetwork';
  }
  return 'errors.unknownError';
};

const postList = (url, watchState) => axios
  .get(addProxy(url))
  .then((response) => {
    const { rssSource, posts } = parse(response.data.contents);

    rssSource.url = url;
    rssSource.id = uniqueId();

    const list = posts.map((post) => Object.assign(post, {
      rssId: rssSource.id,
      postId: uniqueId(),
    }));

    watchState.rssList.unshift(rssSource);
    watchState.postList.unshift(...list);

    watchState.form.processState = 'success';
  })
  .catch((error) => {
    watchState.form.error = getProcessErrorCode(error);
    watchState.form.processState = 'error';
  });

const updateList = (watchState) => {
  const { rssList, postedList } = watchState;

  const promises = rssList.map(({ id, url }) => axios
    .get(addProxy(url))
    .then((response) => {
      const { posts } = parse(response.data.contents);
      const currentPosts = postedList.filter((post) => post.rssId === id);
      const newPosts = posts.map((post) => ({
        ...post,
        rssId: id,
        postId: uniqueId(),
      }));
      const updatedPosts = differenceBy(newPosts, currentPosts, 'link');
      postedList.unshift(...updatedPosts);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error);
    }));

  return Promise.all(promises).finally(() => setTimeout(updateList, 5000, watchState));
};

const app = () => {
  const state = {
    form: {
      processState: 'filling',
      error: null,
    },
    rssList: [],
    postList: [],
    modalId: null,
    seenModalPostIdList: [],
  };

  const elements = {
    form: document.getElementById('form'),
    input: document.getElementById('input'),
    submit: document.getElementById('submit'),
    feedback: document.getElementById('feedback'),
    rssSource: document.getElementById('rssSource'),
    posts: document.getElementById('posts'),
    modal: document.getElementById('modal'),
    modalTitle: document.getElementById('modal-title'),
    modalBody: document.getElementById('modal-body'),
    modalLink: document.getElementById('modal-link'),
  };

  const defaultLanguage = 'ru';

  yup.setLocale({
    mixed: {
      required: () => ({ key: 'errors.validation.required' }),
      notOneOf: () => ({ key: 'errors.validation.invalidLink' }),
    },
    string: {
      url: () => ({ key: 'errors.validation.notUrl' }),
    },
  });

  const i18n = i18next.createInstance();
  i18n
    .init({
      lng: defaultLanguage,
      debug: false,
      resources,
    })
    .then(() => {
      const watchState = onChange(state, initView(elements, i18n, state));

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        watchState.form.processState = 'sending';
        const { value } = e.target.input;

        const schema = yup
          .string()
          .url()
          .notOneOf(watchState.rssList.map((item) => item.url))
          .required();

        schema
          .validate(value, { abortEarly: false })
          .then(() => {
            postList(value, watchState);
          })
          .catch((err) => {
            watchState.form.error = err.message.key;
            watchState.form.processState = 'error';
          });
      });

      elements.posts.addEventListener('click', (e) => {
        const { id } = e.target.dataset;
        watchState.modalId = id;
        watchState.seenModalPostIdList = watchState.seenModalPostIdList.includes(id)
          ? [...watchState.seenModalPostIdList]
          : [...watchState.seenModalPostIdList, id];
      });

      updateList(watchState);
    });
};

export default app;
