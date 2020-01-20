const docs = require('express').Router();
const helpscout = require('./helpscout');

docs.get('/categories/:categoryId/articles', async (req, res) => {
  let { categoryId } = req.params;

  if (!categoryId) {
    return res.sendStatus(422);
  }

  let articles = await helpscout.articlesForCategory({ categoryId });
  res.cacheControl = {
    maxAge: 60 * 5,
  };
  res.send(articles);
});

docs.get(
  '/categories/:categorySlug/articles/:articleSlug',
  async (req, res) => {
    let { categorySlug, articleSlug } = req.params;

    if (!categorySlug && !articleSlug) {
      return res.sendStatus(422);
    }

    try {
      let article = await helpscout.article({ categorySlug, articleSlug });
      res.cacheControl = {
        maxAge: 60 * 5,
      };
      res.send(article);
    } catch (e) {
      return res.sendStatus(404);
    }
  }
);

module.exports = docs;
