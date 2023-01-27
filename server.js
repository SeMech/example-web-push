const path = require('path')
const fastify = require('fastify')({
  logger: true
})
const fastifyStatic = require('@fastify/static')
const {articles} = require('./routes/articles')

const webPush = require('web-push')
const {subscribe} = require('./routes/subscribe')
const {notification} = require('./utils/notification')

require('dotenv').config()

webPush.setVapidDetails(
  'mailto:$email$', // subject
  process.env.VAPID_PUBLIC_KEY, // public key
  process.env.VAPID_PRIVE_KEY // private key
);

const main = async () => {
  await fastify.register(require('fastify-sqlite'), {
    promiseApi: true,
    name: 'db',
    verbose: true,
    dbFile: 'db/db.db',
  })

  await fastify.sqlite.db.run(`CREATE TABLE IF NOT EXISTS "articles" (
        "id" INTEGER PRIMARY KEY,
        "title" VARCHAR,
        "content" TEXT
    )`)

  await fastify.sqlite.db.run(`CREATE TABLE IF NOT EXISTS "subscriptions" (
        "endpoint" VARCHAR,
        "p256dh" VARCHAR,
        "auth" VARCHAR
    )`)

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'client')
  })

  fastify.register(notification)

  fastify.register(articles, { prefix: '/api/articles' })
  fastify.register(subscribe, { prefix: '/api/subscribe' })

  fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  })
}

main()


