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
      elements.input.focus();
      elements.input.classList.remove('is-invalid');
      elements.feedback.classList.remove('text-danger');
      elements.feedback.textContent = i18n.t('success');
      break;

    default:
      throw new Error(`Unknown process: ${process}`);
  }
};

const renderErrorsHandler = (alert, elements, i18n) => {
  let errorMessage = {};

  errorMessage = alert !== undefined /* alert.error.this */
    ? alert.message /* alert.error.this.message */
    : alert; /* alert.error.this */

  if (errorMessage) {
    elements.input.classList.add('is-invalid');
    elements.feedback.classList.add('text-danger');
    if (alert.isParsingError) {
      elements.feedback.textContent = i18n.t('errors.typeError');
    } else if (alert.isNetworkError) {
      elements.feedback.textContent = i18n.t('errors.noNetwork');
    } else {
      elements.feedback.textContent = i18n.t(errorMessage.key);
    }
  } else {
    elements.input.classList.remove('is-invalid');
    elements.feedback.classList.remove('text-danger');
    elements.feedback.textContent = '';
  }
};

const renderRssList = (rss, elements) => {
  const rssSourceContainer = elements.rssSource;

  const divRssSourceContainer = document.createElement('div');
  divRssSourceContainer.classList.add('card', 'border-0');

  const divRssSourceTitleContainer = document.createElement('div');
  divRssSourceTitleContainer.classList.add('card-body');
  const h2Element = document.createElement('h2');
  h2Element.classList.add('card-title', 'h4');
  h2Element.textContent = 'Фиды';
  divRssSourceTitleContainer.append(h2Element);

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

  const ulElement = document.createElement('ul');
  ulElement.classList.add('list-group', 'border-0', 'rounded-0');
  ulElement.append(...liElements);

  divRssSourceContainer.append(divRssSourceTitleContainer, ulElement);

  rssSourceContainer.replaceChildren(divRssSourceContainer);
};

const renderPostList = (posts, elements) => {
  const postListContainer = elements.posts;

  const divPostContainer = document.createElement('div');
  divPostContainer.classList.add('card', 'border-0');

  const divPostTitleContainer = document.createElement('div');
  divPostTitleContainer.classList.add('card-body');
  const h2Element = document.createElement('h2');
  h2Element.classList.add('card-title', 'h4');
  h2Element.textContent = 'Посты';
  divPostTitleContainer.append(h2Element);

  const liElements = posts.map(({ title, postId, link }) => {
    const liElement = document.createElement('li');
    liElement.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );

    const aElement = document.createElement('a');
    aElement.classList.add('fw-bold');
    aElement.setAttribute('href', link);
    aElement.dataset.id = postId;
    aElement.setAttribute('target', '_blank');
    aElement.textContent = title;
    aElement.setAttribute('rel', 'noopener noreferrer');

    const previewButton = document.createElement('button');
    previewButton.setAttribute('type', 'button');
    previewButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    previewButton.dataset.id = postId;
    previewButton.dataset.bsToggle = 'modal';
    previewButton.dataset.bsTarget = '#modal';
    previewButton.textContent = 'Просмотр';

    liElement.append(aElement, previewButton);

    return liElement;
  });

  const ulElement = document.createElement('ul');
  ulElement.classList.add('list-group', 'border-0', 'rounded-0');
  ulElement.append(...liElements);

  divPostContainer.append(divPostTitleContainer, ulElement);

  postListContainer.replaceChildren(divPostContainer);
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

    case 'form.error':
      renderErrorsHandler(value, elements, i18n);
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
