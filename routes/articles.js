async function articles(fastify) {
  fastify.post('/', async req => {
    const { title, content } = req.body

    await fastify.sqlite.db.run('INSERT INTO "articles" ("title", "content") VALUES ($title, $content)', {
      $title: title,
      $content: content
    })

    const article = await fastify.sqlite.db.get('SELECT * FROM "articles" WHERE title = $title AND content = $content', {
      $title: title,
      $content: content
    })

    fastify.notification.sendNotification({ id: article.id, title: article.title })

    return article
  })

  fastify.get('/', async () => {
    return await fastify.sqlite.db.all('SELECT * FROM "articles"')
  })
}

module.exports = {
  articles
}
