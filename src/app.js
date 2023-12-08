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

const postList = (url, watchState) => axios.get(addProxy(url))
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
    /* watchState.form.processState = 'filling'; */
  })
  .catch((error) => {
    watchState.form.error = error;
    /* watchState.list.pop(); */
  });

const updateList = (watchState) => {
  const { rssList, postedList } = watchState;

  const promises = rssList.map(({ id, url }) => axios.get(addProxy(url))
    .then((xml) => parse(xml))
    .then(({ posts }) => {
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
      console.error(`Error: ${error}`);
    }));

  return Promise.all(promises).finally(() => setTimeout(updateList, 5000, watchState));
};

const app = () => {
  const state = {
    form: {
      processState: 'filling',
      error: null,
      processError: null,
    },
    /* list: [], */
    rssList: [],
    postList: [],
    modal: null,
    seenModalPost: null,
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
      const watchState = onChange(state, initView(elements, i18n));

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
            /* watchState.list.push(value.trim()); */
            postList(value.trim(), watchState);
          })
          .catch((err) => {
            watchState.form.error = err;
          });

        watchState.form.processState = 'filling';
      });

      elements.posts.addEventListener('click', (e) => {
        const { id } = e.target.dataset;
        const modalPost = state.postList.find(({ postId }) => postId === id);
        const seenPost = elements.posts.querySelector(`[data-id="${id}"]`);
        watchState.modal = modalPost;
        watchState.seenModalPost = seenPost;
      });

      updateList(watchState);
    });
};

export default app;
