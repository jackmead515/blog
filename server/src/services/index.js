module.exports = {
  blogs: {
    popular: require('./blogs/popular'),
    related: require('./blogs/related'),
    recent: require('./blogs/recent'),
    random: require('./blogs/random'),
    list: require('./blogs/list'),
    get: require('./blogs/get'),
    head: require('./blogs/head'),
    stats: require('./blogs/stats')
  },
  images: {
    list: require('./images/list')
  },
  search: {
    tag: require('./search/tag'),
    term: require('./search/term')
  },
  tags: {
    list: require('./tags/list'),
    top: require('./tags/top')
  },
  lists: {
    stocks: require('./lists/stocks'),
    books: require('./lists/books')
  },
  farm: {
    ingest: require('./farm/ingest'),
  },
  contact: require('./contact')
}