const axios = require('axios');
const nodeCache = require('node-cache');
const cache = new nodeCache({ stdTTL: 60 });

const collectionId = '5e100ebd04286364bc9375f4';

// @ts-ignore
const helpscout = axios.create({
  auth: {
    username: '',
    password: '',
  },
  baseURL: 'https://docsapi.helpscout.net/v1',
});

module.exports = {
  articlesForCategory: async ({ categoryId }) => {
    const cachedCategorySlug = cache.get('docs-category-slug-' + categoryId);
    let categorySlug;
    if (cachedCategorySlug) {
      categorySlug = cachedCategorySlug;
    } else {
      let categoryResponse = await helpscout.get('/categories/' + categoryId);
      categorySlug = categoryResponse.data.category.slug;
      cache.set('docs-category-slug-' + categoryId, categorySlug);
    }

    const cachedArticlesForCategory = cache.get(
      'docs-category-articles-' + categoryId
    );
    let articlesForCategory;
    if (cachedArticlesForCategory) {
      articlesForCategory = cachedArticlesForCategory;
    } else {
      let articleResponse = await helpscout.get(
        '/categories/' + categoryId + '/articles?pageSize=100'
      );
      articlesForCategory = articleResponse.data.articles.items;
      cache.set('docs-category-articles-' + categoryId, articlesForCategory);
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
        '/collections/' + collectionId + '/categories'
      );
      categories = categoriesResponse.data.categories.items;
      cache.set('docs-categories', categories);
    }

    let category = categories.find(
      (category) => category.slug === categorySlug
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
      url: '/help/' + category.slug + '/' + articleData.slug,
      categoryTitle: category.name,
      categorySlug: category.slug,
    };
  },
};
