export function getBaseUrl() {
  const dev = process.env.NODE_ENV === 'development' ? true : false;
  if (dev) {
    return 'http://127.0.0.1:5000'
  } else {
    return 'https://www.speblog.org'
  }
}