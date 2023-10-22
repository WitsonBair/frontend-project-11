import * as yup from 'yup';
import { keyBy, isEmpty } from 'lodash';
import onChange from 'on-change';
import i18next from 'i18next';
import initView from './view.js';
import resources from './locales/index.js';
import postList from './utilis/post_list.js';
import updateList from './utilis/update_list.js';

const app = async () => {
  const state = {
    form: {
      field: {
        this: '',
      },
      processState: '',
      response: {},
      errors: {},
      processError: null,
    },
    list: [],
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

  const i18n = i18next.createInstance();
  i18n.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  });

  yup.setLocale({
    mixed: {
      required: () => ({ key: 'errors.validation.required' }),
      notOneOf: () => ({ key: 'errors.validation.invalidLink' }),
    },
    string: {
      url: () => ({ key: 'errors.validation.notUrl' }),
    },
  });

  const watchState = onChange(state, initView(elements, i18n));

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    watchState.form.processState = 'sending';
    const { value } = e.target.input;
    watchState.form.field.this = value.trim();

    const schema = yup.object().shape({
      this: yup.string().url().notOneOf(watchState.list).required(),
    });

    const validate = (fields) => {
      try {
        schema.validateSync(fields, { abortEarly: false });
        return {};
      } catch (err) {
        return keyBy(err.inner, 'path');
      }
    };

    const error = validate(watchState.form.field);
    watchState.form.errors = { error };

    if (isEmpty(error)) {
      watchState.list.push(value.trim());
      postList(value.trim(), watchState);
    }

    watchState.form.response = value.trim();

    updateList(watchState);

    watchState.form.processState = 'filling';
  });

  elements.posts.addEventListener('click', async (e) => {
    const { id } = e.target.dataset;
    const modalPost = state.postList.find(({ postId }) => postId === id);
    const seenPost = elements.posts.querySelector(`[data-id="${id}"]`);
    watchState.modal = modalPost;
    watchState.seenModalPost = seenPost;
  });
};

export default app;
