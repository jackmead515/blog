export const data = {
  baseUrl: 'https://www.speblog.org'
}

export function initialize() {
  const dev = process.env.NODE_ENV === 'development' ? true : false;

  if (dev) {
    data.baseUrl = 'http://127.0.0.1:5000';
  }
}