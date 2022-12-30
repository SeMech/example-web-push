const path = require('path')
const fastify = require('fastify')({
  logger: true
})
const fastifyStatic = require('@fastify/static')
const {articles} = require('./routes/articles')
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

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'client')
  })

  fastify.register(articles, { prefix: '/api/articles' })

  fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  })
}

main()


