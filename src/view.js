const handleProcessState = (process, elements, i18n) => {
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
      elements.submit.disabled = true;
      break;

    case 'success':
      elements.form.reset();
      elements.form.focus();
      elements.feedback.textContent = i18n.t('success');
      break;

    default:
      throw new Error(`Unknown process: ${process}`);
  }
};

const renderErrorsHandler = (alert, elements, i18n) => {
  let errorMessage = {};

  errorMessage = alert.error.this !== undefined
    ? alert.error.this.message
    : alert.error.this;

  if (errorMessage) {
    elements.input.classList.add('is-invalid');
    elements.feedback.textContent = i18n.t(errorMessage.key);
  } else {
    elements.input.classList.remove('is-invalid');
    elements.feedback.textContent = '';
  }

  if (alert.error.message === "Cannot read properties of null (reading 'textContent')" || alert.error.message === 'xml.querySelector(...) is null') {
    elements.input.classList.add('is-invalid');
    elements.feedback.textContent = i18n.t('errors.typeError');
  }

  if (alert.error.message === 'NetworkError when attempting to fetch resource.') {
    elements.input.classList.add('is-invalid');
    elements.feedback.textContent = i18n.t('errors.noNetwork');
  }
};

const processErrorHandler = () => {};

const renderRssList = (rss, elements) => {
  const rssSourceContainer = elements.rssSource;

  const liElements = rss.map(({ title, description }) => {
    const liElement = document.createElement('li');
    liElement.classList.add('list-group-item', 'border-0', 'border-end-0');

    const h3Element = document.createElement('h3');
    h3Element.classList.add('h6', 'm-0');
    h3Element.textContent = title;

    const pElement = document.createElement('p');
    pElement.classList.add('m-0', 'small', 'text-black-50');
    pElement.textContent = description;

    liElement.append(h3Element, pElement);

    return liElement;
  });

  rssSourceContainer.replaceChildren(...liElements);
};

const renderPostList = (posts, elements) => {
  const postListContainer = elements.posts;

  const liElements = posts.map(({ title, postId, link }) => {
    const liElement = document.createElement('li');
    liElement.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
      'fw-bold',
    );

    const aElement = document.createElement('a');
    aElement.classList.add('link-light');
    aElement.setAttribute('href', link);
    aElement.dataset.id = postId;
    aElement.setAttribute('target', '_blank');
    aElement.textContent = title;
    aElement.setAttribute('rel', 'noopener noreferrer');

    const previewButton = document.createElement('button');
    previewButton.setAttribute('type', 'button');
    previewButton.classList.add('btn', 'btn-outline-light', 'btn-sm');
    previewButton.dataset.id = postId;
    previewButton.dataset.bsToggle = 'modal';
    previewButton.dataset.bsTarget = '#modal';
    previewButton.textContent = 'Просмотр';

    liElement.append(aElement, previewButton);

    return liElement;
  });

  postListContainer.replaceChildren(...liElements);
};

const renderModal = ({ description, link, title }, elements) => {
  elements.modalTitle.textContent = title;
  elements.modalBody.textContent = description;
  elements.modalLink.setAttribute('href', link);
};

const removeBold = (element) => {
  element.classList.remove('fw-bold');
  element.classList.add('fw-normal');
};

const initView = (elements, i18n) => (path, value) => {
  switch (path) {
    case 'form.processState':
      handleProcessState(value, elements, i18n);
      break;

    case 'form.errors':
      renderErrorsHandler(value, elements, i18n);
      break;

    case 'form.processError':
      processErrorHandler();
      break;

    case 'rssList':
      renderRssList(value, elements);
      break;

    case 'postList':
      renderPostList(value, elements);
      break;

    case 'modal':
      renderModal(value, elements);
      break;

    case 'seenModalPost':
      removeBold(value);
      break;

    default:
      break;
  }
};

export default initView;
