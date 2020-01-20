const axios = require('axios');
const nodeCache = require('node-cache');
const cache = new nodeCache({ stdTTL: 60 });
const slug = require('slug');

// @ts-ignore
const helpscout = axios.create({
  auth: {
    username: process.env.HELPSCOUT_DOCS_API_KEY,
    password: 'X',
  },
  baseURL: 'https://docsapi.helpscout.net/v1',
});

module.exports = {
  category: async ({ categorySlug }) => {
    categorySlug = categorySlug.toLowerCase();

    // Get category ID for given category slug
    const cachedCategories = cache.get('docs-categories');
    let categories;
    if (cachedCategories) {
      categories = cachedCategories;
    } else {
      let categoriesResponse = await helpscout.get(
        '/collections/' +
          process.env.HELPSCOUT_DOCS_COLLECTION_ID +
          '/categories'
      );
      categories = categoriesResponse.data.categories.items;
      cache.set('docs-categories', categories);
    }

    let category = categories.find(
      (category) => slug(category.name, { lower: true }) === categorySlug
    );

    if (!category) {
      return;
    } else {
      return {
        name: category.name,
        url: `/help/${slug(category.name, { lower: true })}`,
      };
    }
  },
  articlesForCategory: async ({ categorySlug }) => {
    categorySlug = categorySlug.toLowerCase();

    // Get category ID for given category slug
    const cachedCategories = cache.get('docs-categories');
    let categories;
    if (cachedCategories) {
      categories = cachedCategories;
    } else {
      let categoriesResponse = await helpscout.get(
        '/collections/' +
          process.env.HELPSCOUT_DOCS_COLLECTION_ID +
          '/categories'
      );
      categories = categoriesResponse.data.categories.items;
      cache.set('docs-categories', categories);
    }

    let category = categories.find(
      (category) => slug(category.name, { lower: true }) === categorySlug
    );

    if (!category) {
      return;
    }

    const cachedArticlesForCategory = cache.get(
      'docs-category-articles-' + category.id
    );
    let articlesForCategory;
    if (cachedArticlesForCategory) {
      articlesForCategory = cachedArticlesForCategory;
    } else {
      let articleResponse = await helpscout.get(
        '/categories/' + category.id + '/articles?pageSize=100'
      );
      articlesForCategory = articleResponse.data.articles.items;
      cache.set('docs-category-articles-' + category.id, articlesForCategory);
    }

    return articlesForCategory.map((article) => {
      return {
        name: article.name,
        url: `/help/${categorySlug}/${article.slug}`,
      };
    });
  },
  article: async ({ categorySlug, articleSlug }) => {
    // Get category ID for given category slug
    const cachedCategories = cache.get('docs-categories');
    let categories;
    if (cachedCategories) {
      categories = cachedCategories;
    } else {
      let categoriesResponse = await helpscout.get(
        '/collections/' +
          process.env.HELPSCOUT_DOCS_COLLECTION_ID +
          '/categories'
      );
      categories = categoriesResponse.data.categories.items;
      cache.set('docs-categories', categories);
    }

    let category = categories.find(
      (category) => slug(category.name, { lower: true }) === categorySlug
    );

    if (!category) {
      return;
    }

    const cachedArticlesForCategory = cache.get(
      'docs-category-' + category.id + '-articles'
    );
    let articles;
    if (cachedArticlesForCategory) {
      articles = cachedArticlesForCategory;
    } else {
      let articlesResponse = await helpscout.get(
        '/categories/' + category.id + '/articles?pageSize=100'
      );
      articles = articlesResponse.data.articles.items;
      cache.set('docs-category-' + category.id + '-articles', articles);
    }

    let article = articles.find((article) => article.slug === articleSlug);

    const cachedArticleData = cache.get('docs-articles-' + article.id);
    let articleData;
    if (cachedArticleData) {
      articleData = cachedArticleData;
    } else {
      let articleDataResponse = await helpscout.get('/articles/' + article.id);
      articleData = articleDataResponse.data.article;
      cache.set('docs-articles-' + article.id, articleData);
    }

    return {
      title: articleData.name,
      body: articleData.text,
      url:
        '/help/' +
        slug(category.name, { lower: true }) +
        '/' +
        articleData.slug,
      categoryTitle: category.name,
      categorySlug: slug(category.name, { lower: true }),
      categoryId: category.id,
    };
  },
};
