const getNotifyPermitted = () => {
  return new Promise((resolve) => {
    if ('Notification' in window) { // смотрим доступны ли уведомления в браузере
      if (Notification.permission === 'granted') // если Notification.permission имеет значение 'granted', то разрешение уже получено
        resolve(true) // возвращаем true
      if (Notification.permission !== 'denied') // permission != 'denied', то есть default, это означает, что разрешение еще не запрашивалось
        Notification.requestPermission().then((permission) => { // запршиваем разрешение (то самое бесячее окошко браузера на каждом новостном сайте)
          if (permission === 'granted') // если получанное разрешение 'granted', возвращаем true
            resolve(true)
          else // если нет, соответственно возвращаем false
            resolve(false)
        })
    }
    // Если в браузере нет Notification или permission = 'denied', возвращаем false
    resolve(false)
  })
}

/**
 * @param {ServiceWorkerRegistration} registration
 * @returns {Promise<PushSubscription>}
 */
const subscribePushManager = async (registration) => {
  let subscription = await registration.pushManager.getSubscription()

  if (subscription)
    return subscription

  const vapidKey = await getPublicVapidKey()
  const convertedVapidKey = urlBase64ToUint8Array(vapidKey)

  subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey
  })

  await subscribe({ subscription })

  return subscription
}

const registerNotification = async () => {
  const notifyPermitted = await getNotifyPermitted()

  // Если браузер поддерживает serviceWorkers и дал разрешение на уведомления
  if (notifyPermitted && 'serviceWorker' in navigator) {
    // регистрируем serviceWorker
    const registration = await navigator.serviceWorker
      .register(location.origin + '/assets/js/sw.js')

    // проверяем подписку, или подписываемся если ее нет
    await subscribePushManager(registration)
  }
}
