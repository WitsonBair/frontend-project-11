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
