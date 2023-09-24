const handleProcessState = (process, elements) => {
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

const renderErrorsHandler = (alert, elements, i18n) => {
  const errorMessage = alert.error.this !== undefined
    ? alert.error.this.message
    : alert.error.this;

  if (errorMessage) {
    elements.input.classList.add('is-invalid');
    elements.feedback.textContent = i18n.t(errorMessage.key);
  } else {
    elements.input.classList.remove('is-invalid');
    elements.feedback.textContent = '';
  }
};

const makeListHandler = () => {};

const processErrorHandler = () => {};

const initView = (elements, i18n) => (path, value) => {
  switch (path) {
    case 'form.processState':
      handleProcessState(value, elements);
      break;

    case 'form.errors':
      renderErrorsHandler(value, elements, i18n);
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
