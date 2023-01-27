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

async function getPublicVapidKey() {
  return await fetch('/api/subscribe/public-key', {method: 'GET'}).then(res => res.text())
}

async function subscribe(payload) {
  return await fetch('/api/subscribe', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
}
