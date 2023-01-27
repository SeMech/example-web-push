async function subscribe(fastify) {
  fastify.get('/public-key', async () => {
    return process.env.VAPID_PUBLIC_KEY
  })

  fastify.post('/', async req => {
    const { subscription } = req.body

    return fastify.sqlite.db.run('INSERT INTO "subscriptions" (endpoint, p256dh, auth) VALUES ($endpoint, $p256dh, $auth)', {
      $endpoint: subscription.endpoint,
      $p256dh: subscription.keys.p256dh,
      $auth: subscription.keys.auth
    })
  })
}

module.exports = { subscribe }
