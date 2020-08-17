if (process.env.NODE_ENV !== 'production') {
  console.log('creating tags list');
  require('../util/tags');
  console.log('creating related list');
  require('../util/related');
  console.log('creating sitemap.xml');
  require('../util/sitemap');
  console.log('generating markdown');
  require('../util/markdown');
}