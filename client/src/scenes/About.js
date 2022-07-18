import React from "react";

import SearchBar from "../components/search/SearchBar";

import showdown from "showdown";
import Prism from 'prismjs';

const converter = new showdown.Converter({
    tables: true,
    tasklists: true,
    openLinksInNewWindow: true,
    emoji: true
});

converter.setFlavor('github');

class About extends React.PureComponent {

  render() {

    const content = converter.makeHtml(`
\t Hey I'm Jack. This is my blog. Welcome.

I'm a software engineer. But also an adventurer. So if I feel up for it, I'll write some pretty unrelated articles.

That said, I've worked with a lot of technologies. Web, mobile, game, desktop, backend, firmware, video, big data, machine learning, algorithms, you name it.

Though, I specialize in backend and big data. It's fun to see the massive numbers and statistics for all the data I get to move around.

I like to write about programming, IOT, big data, machine learning, and more. Honestly whatever I'm currently interested in at the time.

If you find something interesting, I'd love to hear about it. You can open a pull request on [GitHub](https://github.com/jackmead515/blog). Ask a question. Give some feedback. Make a suggestion. Go for it I don't mind. The more help the better this blog will be for you and for me.

\t How to use this blog

Try the search bar at the top. Search for whatever you want. I purposefully made the UI and UX simplistic for your convenience.

Once your on a blog, there are related tags at the top you can click on. And if you scroll to the bottom you'll see related content curated algorithmically.

And that's about it. I hope you enjoy this blog. I know I've enjoyed writing the content and learning.
    `);

    return (
      <div className="home">
        <div className="home__wrapper">
          <SearchBar />
          <div
            className="blog__content" 
            dangerouslySetInnerHTML={{__html: content}} />
        </div>
      </div>
    );
  }

}

export default About;
