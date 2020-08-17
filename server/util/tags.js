const fs = require('fs');
const path = require('path');
const blogsPath = path.join(__dirname, '/../src/blogs/json');
const tagsPath = path.join(__dirname, '/../src/resources/tags.json');

const tags = fs.readdirSync(blogsPath)
  .filter((file) => fs.statSync(path.join(blogsPath, file)).isFile())
  .map((file) => {
    const data = fs.readFileSync(path.join(blogsPath, file));
    const json = JSON.parse(data);
    return json.head.tags
  })
  .reduce((a, o) => a.concat(o), []);

const uniqueTags = [...new Set(tags)];
const counts = uniqueTags.map((tag) => ({
  tag,
  count: tags.filter((t) => t === tag).length 
}));
counts.sort((a, b) => b.count - a.count);

fs.writeFileSync(tagsPath, JSON.stringify(counts));