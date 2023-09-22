import * as yup from 'yup';
import _ from 'lodash';
import onChange from 'on-change';
import axios from 'axios';
import i18next from 'i18next';
import resources from './locales/index.js';
import watch from './view.js';

export default async () => {
  const defaultLanguage = 'ru';

  const state = {
    form: {
      status: null,
      valid: false,
      errors: [],
    },
    list: [],
  };

  const elements = {
    form: document.getElementById('form'),
    input: document.getElementById('input'),
    errorFields: {},
  };

  yup.setLocale({
    mixed: {
      required: () => ({ key: 'errors.validation.required' }),
      notOneOf: () => ({ key: 'errors.validation.invalidLink' }),
    },
    string: {
      url: () => ({ key: 'errors.validation.notUrl' }),
    },
  });

  const schema = yup.object({
    input: yup.string().url().required(),
  });

  /* const validate = (fields) => {
    try {
      schema.validate(fields, { abortEarly: false });
      return {};
    } catch (e) {
      return _.keyBy(e.inner, 'path');
    }
  }; */

  const i18n = i18next.createInstance();
  await i18n.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  });

  const watchedState = watch(state, elements, i18n);
  watchedState.form.processState = 'filling';

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const input = Object.fromEntries(formData);
    try {
      await schema.validate(input, { abortEarly: false });
      watchedState.form.errors = [];
      watchedState.form.valid = true;
    } catch (err) {
      const validationError = err.inner.reduce((acc, cur) => {
        const { path, message } = cur;
        const errorData = acc[path] || [];
        return { ...acc, [path]: [...errorData, message] };
      });
      watchedState.form.errors = validationError;
    }
  });
};
