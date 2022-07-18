import React from "react";

import BlogList from "../components/blog/BlogList";
import SearchBar from "../components/search/SearchBar";

class App extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="home">
        <div className="home__wrapper">
          <SearchBar />
          <BlogList />
        </div>
      </div>
    );
  }

}

export default App;
