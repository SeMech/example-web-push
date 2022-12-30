const ID_POPUPS = {
  CREATE: 'popup-create',
  VIEW: 'popup-article'
}

const articleCardTemplate = ({ id, title, content }) => `
  <div class="article_card" data-article="${id}">
    <div class="article_card-text_content">
      <div class="article_card-title">${title}</div>
      <div class="article_card-description">${content ? (content.length > 300 ? content.substring(0, 300) + '...' : content) : ''}</div>
    </div>
    <button class="common-button button-show_article" data-article="${id}" data-popup="${ID_POPUPS.VIEW}">Посмотреть</button>
  </div>
`

const articlePopupTemplate = ({ title, content }) => `
  <div class="popup_article-title">${title}</div>
  <div class="popup_article-content">${content || ''}</div>
`

function main() {
  const POPUPS = {
    CREATE: document.getElementById(ID_POPUPS.CREATE),
    VIEW: document.getElementById(ID_POPUPS.VIEW)
  }

  const POPUP_VIEW_BODY = POPUPS.VIEW.querySelector('.popup_article-body')

  const BUTTONS = {
    OPEN_CREATE: document.getElementById('button-show_create_article'),
    CLOSE_POPUP: document.querySelectorAll('.button-close_popup[data-popup]'),
    SAVE_ARTICLE: document.getElementById('button-save-article'),
    SHOW_ARTICLE: () => document.querySelectorAll('.button-show_article[data-article][data-popup]')
  }

  const INPUTS = {
    CREATE_ARTICLE: {
      TITLE: document.getElementById('input-title-popup'),
      CONTENT: document.getElementById('input-content-popup')
    }
  }

  const ARTICLE_CARD_WRAPPER = document.getElementById('articles-wrapper')

  const updateArticleCardContent = async () => {
    const articles = await updateArticles()
    ARTICLE_CARD_WRAPPER.innerHTML = articles.map(article => articleCardTemplate(article)).join('')

    BUTTONS.SHOW_ARTICLE().forEach(buttonShowArticle => {
      const attrPopup = buttonShowArticle.getAttribute('data-popup')
      const attrArticle = buttonShowArticle.getAttribute('data-article')
      const keyPopup = Object.keys(ID_POPUPS).find(key => ID_POPUPS[key] === attrPopup)
      if (!keyPopup) return

      const currentPopup = POPUPS[keyPopup]
      const currentArticle = articles.find(article => article.id === +attrArticle)

      const popupTemplate = articlePopupTemplate(currentArticle)

      buttonShowArticle.addEventListener('click', () => {
        POPUP_VIEW_BODY.innerHTML = popupTemplate

        if (!currentPopup.classList.contains('showed'))
          currentPopup.classList.add('showed')
      })
    })
  }

  const closePopup = (popup) => {
    if (popup.classList.contains('showed'))
      popup.classList.remove('showed')
  }

  BUTTONS.OPEN_CREATE.addEventListener('click', () => {
    INPUTS.CREATE_ARTICLE.TITLE.value = ''
    INPUTS.CREATE_ARTICLE.CONTENT.value = ''

    if (!POPUPS.CREATE.classList.contains('showed'))
      POPUPS.CREATE.classList.add('showed')
  })

  BUTTONS.SAVE_ARTICLE.addEventListener('click', async () => {
    const payload = {
      title: INPUTS.CREATE_ARTICLE.TITLE.value,
      content: INPUTS.CREATE_ARTICLE.CONTENT.value
    }

    await createArticle(payload).catch((e) => {
      console.log(e)
      alert('Не удалось создать статью!\nПопробуйте заново')
    })

    await updateArticleCardContent()

    INPUTS.CREATE_ARTICLE.TITLE.value = ''
    INPUTS.CREATE_ARTICLE.CONTENT.value = ''
    closePopup(POPUPS.CREATE)
  })

  BUTTONS.CLOSE_POPUP.forEach(buttonClosePopup => {
    const attrPopup = buttonClosePopup.getAttribute('data-popup')
    const keyPopup = Object.keys(ID_POPUPS).find(key => ID_POPUPS[key] === attrPopup)
    if (!keyPopup) return

    const currentPopup = POPUPS[keyPopup]

    buttonClosePopup.addEventListener('click', () => {
      if (attrPopup === ID_POPUPS.VIEW)
        POPUP_VIEW_BODY.innerHTML = ''

      closePopup(currentPopup)
    })
  })


  updateArticleCardContent()
}

async function updateArticles() {
  return await fetch('/api/articles', {method: 'GET'}).then(res => res.json())
}

async function createArticle(payload) {
  return await fetch('/api/articles', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
}

window.addEventListener('DOMContentLoaded', main)
