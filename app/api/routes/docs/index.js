const docs = require('express').Router();
const helpscout = require('./helpscout');

let viewCounts = {};

const logViewCount = (articleId) => {
  if (!viewCounts[articleId]) {
    viewCounts[articleId] = 0;
  }

  viewCounts[articleId]++;

  // For bandwidth, wait until view count reaches a certain
  // point before logging hits with the Helpscout service.
  if (viewCounts[articleId] >= 10) {
    // Log the hits
    helpscout.updateViewCount({ articleId, count: viewCounts[articleId] });
    viewCounts[articleId] = 0;
  }
};

docs.get('/categories/:categorySlug', async (req, res) => {
  let { categorySlug } = req.params;

  if (!categorySlug) {
    return res.sendStatus(422);
  }

  let category = await helpscout.category({ categorySlug });
  res.cacheControl = {
    maxAge: 60 * 5,
  };
  return category ? res.send(category) : res.sendStatus(404);
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
      logViewCount(article.articleId);
    } catch (e) {
      return res.sendStatus(404);
    }
  }
);

docs.get('/articles', async (req, res) => {
  let { query } = req.query;

  if (!query) {
    return res.sendStatus(422);
  }
  let articles = await helpscout.search({ query });
  res.cacheControl = {
    maxAge: 60 * 5,
  };
  res.send(articles);
});

module.exports = docs;
