import axios from 'axios';
import * as yup from 'yup';
import _ from 'lodash';
import onChange from 'on-change';
import i18next from 'i18next';
import initView from './view.js';
import resources from './locales/index.js';

const app = () => {
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
  };

  const elements = {
    form: document.getElementById('form'),
    input: document.getElementById('input'),
    submit: document.getElementById('submit'),
  };

  const defaultLanguage = 'ru';

  const i18n = i18next.createInstance();
  i18n.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  });

  const watchState = onChange(state, initView(elements));

  yup.setLocale({
    mixed: {
      required: () => ({ key: 'errors.validation.required' }),
      notOneOf: () => ({ key: 'errors.validation.invalidLink' }),
    },
    string: {
      url: () => ({ key: 'errors.validation.notUrl' }),
    },
  });

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

  elements.input.addEventListener('input', (e) => {
    e.preventDefault();
    watchState.form.processState = 'filling';
    const { value } = e.target;
    watchState.form.field.this = value.trim();
    const error = validate(watchState.form.field);
    watchState.form.errors = { error };
  });

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    watchState.form.processState = 'sending';
    const { value } = e.target.input;
    watchState.form.field.this = value.trim();
    const error = validate(watchState.form.field);
    watchState.form.errors = { error };

    watchState.list.push(e.target.input.value);
    watchState.form.processState = 'success';
    watchState.form.processState = 'filling';
  });
};

export default app;
