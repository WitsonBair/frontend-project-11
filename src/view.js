const renderErrorsHandler = (errorMessage, elements, i18n) => {
  if (!errorMessage) return;

  elements.input.classList.add('is-invalid');
  elements.feedback.classList.add('text-danger');
  elements.feedback.textContent = i18n.t(errorMessage);
};

const handleProcessState = (process, elements, i18n, state) => {
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
      renderErrorsHandler(state.form.error, elements, i18n);
      elements.input.disabled = false;
      elements.submit.disabled = false;
      break;

    case 'success':
      elements.input.disabled = false;
      elements.submit.disabled = false;
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

const renderRssList = (rss, elements, i18n) => {
  const rssSourceContainer = elements.rssSource;

  const divRssSourceContainer = document.createElement('div');
  divRssSourceContainer.classList.add('card', 'border-0');

  const divRssSourceTitleContainer = document.createElement('div');
  divRssSourceTitleContainer.classList.add('card-body');
  const h2Element = document.createElement('h2');
  h2Element.classList.add('card-title', 'h4');
  h2Element.textContent = i18n.t('feed.feeds');
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

const renderPostList = (posts, elements, i18n, state) => {
  const postListContainer = elements.posts;

  const divPostContainer = document.createElement('div');
  divPostContainer.classList.add('card', 'border-0');

  const divPostTitleContainer = document.createElement('div');
  divPostTitleContainer.classList.add('card-body');
  const h2Element = document.createElement('h2');
  h2Element.classList.add('card-title', 'h4');
  h2Element.textContent = i18n.t('feed.posts');
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
    if (state.seenModalPostIdList.includes(postId)) {
      aElement.classList.add('fw-normal');
    } else {
      aElement.classList.add('fw-bold');
    }
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

const renderModal = (id, elements, state) => {
  const { description, link, title } = state.postList.find(({ postId }) => postId === id);
  elements.modalTitle.textContent = title;
  elements.modalBody.textContent = description;
  elements.modalLink.setAttribute('href', link);
  const seenModalPost = elements.posts.querySelector(`[data-id="${id}"]`);
  seenModalPost.classList.remove('fw-bold');
  seenModalPost.classList.add('fw-normal');
};

const initView = (elements, i18n, state) => (path, value) => {
  switch (path) {
    case 'form.processState':
      handleProcessState(value, elements, i18n, state);
      break;

    case 'rssList':
      renderRssList(value, elements, i18n);
      break;

    case 'postList':
      renderPostList(value, elements, i18n, state);
      break;

    case 'modalId':
      renderModal(value, elements, state);
      break;

    default:
      break;
  }
};

export default initView;
