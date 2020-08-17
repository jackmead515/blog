const fs = require('fs');
const path = require('path');
const blogsPath = path.join(__dirname, '/../src/blogs/json');
const relatedPath = path.join(__dirname, '/../src/resources/related.json');

function calculateWeighted(blog) {
  let { title, subtitle, link, tags = []} = blog.head;

  title = subtitle.toLowerCase().split(' ');
  subtitle = subtitle.toLowerCase().split(' ');
  link = link.toLowerCase().split('-');

  return (related) => {
    if (related.head.link === blog.head.link) {
      return null;
    }

    const titleMatch = title
      .map((piece) => related.head.title.toLowerCase().match(piece))
      .filter((m) => m)
      .length;
    const subtitleMatch = subtitle
      .map((piece) => related.head.subtitle.toLowerCase().match(piece))
      .filter((m) => m)
      .length;
    const linkMatch = link
      .map((piece) => related.head.link.toLowerCase().match(piece))
      .filter((m) => m)
      .length;
    const tagsMatch = tags.filter((tag) => related.head.tags.find((rtag) => rtag === tag)).length;

    const weighted = (tagsMatch*10)+(titleMatch*5)+(subtitleMatch*5)+(linkMatch*5)

    return [related.head.link, weighted];
  }
}

const blogs = fs.readdirSync(blogsPath)
  .filter((file) => fs.statSync(path.join(blogsPath, file)).isFile())
  .map((file) => {
    const data = fs.readFileSync(path.join(blogsPath, file));
    const json = JSON.parse(data);
    return {
      file: file,
      head: json.head
    };
  })
  .reduce((acc, blog, i, array) => {
    let relatedBlogs = array
      .map(calculateWeighted(blog))
      .filter((b) => b);
    relatedBlogs.sort((a, b) => b[1] - a[1]);
    relatedBlogs = relatedBlogs.slice(0, 10);
    acc[blog.head.link] = relatedBlogs;
    return acc;
  }, {});

fs.writeFileSync(relatedPath, JSON.stringify(blogs));