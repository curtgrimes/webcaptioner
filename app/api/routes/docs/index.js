const docs = require('express').Router();
const helpscout = require('./helpscout');

docs.get('/categories/:categorySlug', async (req, res) => {
  let { categorySlug } = req.params;

  if (!categorySlug) {
    return res.sendStatus(422);
  }

  let category = await helpscout.category({ categorySlug });
  res.cacheControl = {
    maxAge: 60 * 5,
  };
  res.send(category);
});

docs.get('/categories/:categorySlug/articles', async (req, res) => {
  let { categorySlug } = req.params;

  if (!categorySlug) {
    return res.sendStatus(422);
  }

  let articles = await helpscout.articlesForCategory({ categorySlug });

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
