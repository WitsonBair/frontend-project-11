import axios from 'axios';
import * as yup from 'yup';
import _ from 'lodash';
import onChange from 'on-change';
import i18next from 'i18next';
import initView from './view.js';
import resources from './locales/index.js';
import parse from './parse.js';
import getData from './utilis/get-data.js';
import makeList from './utilis/make_list.js';

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
  };

  const elements = {
    form: document.getElementById('form'),
    input: document.getElementById('input'),
    submit: document.getElementById('submit'),
    feedback: document.getElementById('feedback'),
    rssSource: document.getElementById('rssSource'),
    posts: document.getElementById('posts'),
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

  elements.input.addEventListener('input', (e) => {
    e.preventDefault();
    watchState.form.processState = 'filling';
    const { value } = e.target;
    watchState.form.field.this = value.trim();

    const schema = yup.object().shape({
      this: yup.string().url().notOneOf(watchState.list).required(),
    });

    const validate = (fields) => {
      try {
        schema.validateSync(fields, { abortEarly: false });
        return {};
      } catch (e) {
        return _.keyBy(e.inner, 'path');
      }
    };

    const error = validate(watchState.form.field);
    watchState.form.errors = { error };
  });

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    watchState.form.processState = 'sending';
    const { value } = e.target.input;
    watchState.form.field.this = value.trim();

    watchState.list.push(e.target.input.value);

    const xmlData = getData(value.trim());
    xmlData
      .then((data) => new DOMParser().parseFromString(data, 'text/xml'))
      .then((xml) => {
        const { rssSource, posts } = parse(xml, value.trim());
        const list = makeList(rssSource, posts);
        watchState.rssList.unshift(rssSource);
        watchState.postList.unshift(...list);
      })
      .catch((error) => {
        watchState.form.errors = { error };
      });

    watchState.form.response = value.trim();

    watchState.form.processState = 'success';
    watchState.form.processState = 'filling';
  });
};

export default app;
