const webPush = require('web-push')
const fp = require('fastify-plugin')

const getFormatSubscriptionForSend = (subscription) => ({
  endpoint: subscription.endpoint,
  keys: {
    p256dh: subscription.p256dh,
    auth: subscription.auth
  }
})

/**
 * @param {fastify} fastify
 * @returns {Promise<void>}
 */
function notification(fastify, opts, next) {
  async function sendNotification({ id, title }) {
    const subscriptions = await fastify.sqlite.db.all('SELECT * FROM "subscriptions"')

    for await (let subscription of subscriptions) {
      const formatSubscription = getFormatSubscriptionForSend(subscription)
      const payload = JSON.stringify({ id, title })
      const options = {}

      try {
        await webPush.sendNotification(
          formatSubscription,
          payload,
          options
        )
      } catch (e) {
        if (e.statusCode === 410) { // если подписки больше не существует, или она не доступна
          await fastify.sqlite.db.run('DELETE FROM "subscriptions" WHERE endpoint = $endpoint', {
            $endpoint: e.endpoint
          })
        }
      }
    }
  }

  fastify.decorate('notification', { sendNotification })

  next()
}

module.exports = fp(notification, {
  name: 'notification'
})
