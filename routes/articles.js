async function articles(fastify) {
  fastify.post('/', async req => {
    const { title, content } = req.body

    return fastify.sqlite.db.run('INSERT INTO "articles" ("title", "content") VALUES ($title, $content)', {
      $title: title,
      $content: content
    })
  })

  fastify.get('/', async () => {
    return await fastify.sqlite.db.all('SELECT * FROM "articles"')
  })
}

module.exports = {
  articles
}
