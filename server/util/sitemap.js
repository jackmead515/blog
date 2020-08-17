const xml = require('xml');
const fs = require('fs');
const path = require('path');
const blogsPath = path.join(__dirname, '/../src/blogs/json');
const sitemapPath = path.join(__dirname, '/../src/resources/sitemap.xml');

const domain = 'https://www.speblog.org';

const extra = [
  `${domain}/about/`
]

function getLastModified(filePath) {
  const lmod = new Date(fs.statSync(filePath).mtime);

  let month = lmod.getMonth().toString();
  if (month.length === 1) {
    month = '0'.concat(month);
  }
  let day = lmod.getDate().toString();
  if (day.length === 1) {
    day = '0'.concat(day);
  }

  return `${lmod.getFullYear()}-${month}-${day}`;
}

const urls = fs.readdirSync(blogsPath)
  .filter((file) => fs.statSync(path.join(blogsPath, file)).isFile())
  .map((file) => {
    const filePath = path.join(blogsPath, file)
    const data = fs.readFileSync(filePath);
    const json = JSON.parse(data);
    const loc = `${domain}/blog/${json.head.link}/`;
    const lastmod = getLastModified(filePath);
    return { url: [ { loc }, { lastmod } ] };
  });

const object = {
  urlset: [
    { _attr: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' } },
    ...urls
  ]
}

const sitemapString = xml(object, { declaration: true });

fs.writeFileSync(sitemapPath, sitemapString);
