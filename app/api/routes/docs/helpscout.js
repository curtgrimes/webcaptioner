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

    return articlesForCategory
      .filter((article) => article.status === 'published')
      .map((article) => {
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

    let article = articles.find(
      (article) =>
        article.slug === articleSlug && article.status === 'published'
    );

    if (!article) {
      return;
    }

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
      articleId: article.id,
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

  search: async ({ query }) => {
    const cachedSearchResults = cache.get('docs-search-' + query);
    let articles;
    if (cachedSearchResults) {
      articles = cachedSearchResults;
    } else {
      let searchResults = await helpscout.get('/search/articles', {
        params: {
          query,
        },
      });
      articles = searchResults.data.articles.items;

      cache.set('docs-search-' + query, articles);
    }

    // Get categories
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

    categories = categories.map((category) => ({
      id: category.id,
      name: category.name,
    }));

    articles = articles.map((article) => {
      let category = categories.find(
        (category) => category.id === article.categoryIds[0]
      );
      return {
        name: article.name,
        preview: article.preview,
        url:
          '/help/' +
          slug(category.name, { lower: true }) +
          '/' +
          slug(article.name, { lower: true }),
      };
    });

    return articles;
  },

  updateViewCount: async ({ articleId, count }) => {
    try {
      await helpscout.put(`/articles/${articleId}/views`, {
        count,
      });
    } catch (e) {
      console.error('Could not update view count for article ' + articleId);
    }
  },
};
