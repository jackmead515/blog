const showdown = require('showdown');

showdown.setOption('tasklists', true);
showdown.setOption('openLinksInNewWindow', true);
showdown.setOption('emoji', true);
showdown.setOption('literalMidWordUnderscores', true);
showdown.setOption('tables', true);

const markDownConverter = new showdown.Converter();

const fs = require('fs');
const path = require('path');
const blogsPath = path.join(__dirname, '/../src/blogs/json');
const markdownPath = path.join(__dirname, '/../src/blogs/markdown');

fs.readdirSync(blogsPath)
  .filter(file => fs.statSync(path.join(blogsPath, file)).isFile())
  .map(file => {
    const data = fs.readFileSync(path.join(blogsPath, file));
    const json = JSON.parse(data);
    return { file, json };
  })
  .filter(({ json }) => json.head.markdown)
  .map(({ file, json }) => {
    const fileName = `${file.split('.')[0]}.md`;
    const markPath = path.join(markdownPath, fileName);
    if (json.head.markdown && !fs.statSync(markPath).isFile()) {
      throw new Error(`${file} does not have an associated markdown file`);
    }
    const data = fs.readFileSync(markPath).toString();
    const html = markDownConverter.makeHtml(data);
    json.contents = html;
    return { file, json };
  })
  .forEach(({ file, json }) => {
    const jsonPath = path.join(blogsPath, file);
    fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2));
  });

