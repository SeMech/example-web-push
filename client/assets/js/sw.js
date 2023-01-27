self.addEventListener('push', (event) => {
  const data = event.data.json()

  event.waitUntil(
    self.registration.showNotification('Новая статья', {
      body: data.title,
      data
    })
  )
})
