import onChange from 'on-change';

export default (state, elements, i18n) => {
  const { form, fields, errorFields } = elements;

  const handleErrors = () => {
    const formFields = Object.keys(fields);
    formFields.forEach((item) => {
      if (!state.form.errors[item]) {
        fields[item].classList.remove('is-invalid');
        fields[item].classList.add('is-valid');
      } else {
        fields[item].classList.add('is-invalid');
        fields[item].classList.remove('is-valid');
        const itemErrors = state.form.errors[item];
        itemErrors.forEach((error) => {
          errorFields[item].textContent = i18n.t(error.key, error.values);
        });
      }
    });
  };

  const clearErrors = () => {
    Object.values(errorFields).forEach((field) => {
      field.textContent = '';
    });
  };

  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'form.status':
        break;
      case 'form.errors':
        handleErrors();
        break;
      case 'form.valid':
        clearErrors();
        break;
      default:
        break;
    }
  });

  return watchedState;
};

/* const handleProcessState = (process, elements) => {
  switch (process) {
    case 'filling':
      elements.input.disabled = false;
      elements.submit.disabled = false;
      break;

    case 'sending':
      elements.input.disabled = true;
      elements.submit.disabled = true;
      break;

    case 'error':
      elements.submit.disabled = false;
      break;

    case 'success':
      elements.form.reset();
      elements.form.focus();
      break;

    default:
      throw new Error(`Unknown process: ${process}`);
  }
};

const renderErrorsHandler = (alert, elements) => {
  const errorMessage = alert.error.this !== undefined
    ? alert.error.this.message
    : alert.error.this;

  if (errorMessage) {
    elements.input.classList.add('is-invalid');
  } else {
    elements.input.classList.remove('is-invalid');
  }
};

const makeListHandler = () => {};

const processErrorHandler = () => {};

const initView = (elements) => (path, value) => {
  switch (path) {
    case 'form.processState':
      handleProcessState(value, elements);
      break;

    case 'form.errors':
      renderErrorsHandler(value, elements);
      break;

    case 'form.response':
      makeListHandler();
      break;

    case 'form.processError':
      processErrorHandler();
      break;

    default:
      break;
  }
};

export default initView;
*/
