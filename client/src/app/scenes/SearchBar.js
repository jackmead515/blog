import React, { Component } from 'react'
import axios from 'axios';
import FAIcon from 'react-fontawesome';

import LineLoader from '../components/LineLoader';

export default class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetching: false,
      results: [],
      search: ''
    }

    this.searchTimeout = null;
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  componentWillUnmount() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = null;
  }

  resetTimeout() {
    const { search } = this.state;

    if (search.length <= 0) {
      this.setState({ results: [] });
      return;
    }
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.fetchResults();
    }, 300);
  }

  fetchResults() {
    const { search, fetching } = this.state;

    if (!fetching && search.length > 0) {
      this.setState({ fetching: true }, () => {
        axios.post('/search/term', { term: search }).then((response) => {
          this.setState({ fetching: false, results: response.data });
        }).catch((err) => {
          this.setState({ fetching: false, results: [] });
        });
      });
    }
  }

  onSearchChange(e) {
    this.setState({search: e.target.value}, () => this.resetTimeout());
  }

  renderResults() {
    const { results, fetching } = this.state;

    if(results.length) {
      return (
        <div className="search_results">
          {results.map((result, i) => {
            return (
              <a
                key={i}
                href={`/blog/${result.link}`}
              >
                <b>{result.title}</b> - {result.subtitle}
              </a>
            )
          })}
        </div>
      )
    } else if(fetching) {
      return (
        <div className="search_results">
          <LineLoader />
        </div>
      )
    }
  }

  render() {
    return (
      <div
        className="search_container"
        onBlur={() => {
          setTimeout(() => {
            this.setState({ search: '', results: [] })
          }, 100)
        }}
      >
        <div className="search_icon">
          <FAIcon name="search" />
        </div>
        <div className="search_field">
          <input
            type="text"
            placeholder="Search for blogs..."
            value={this.state.search}
            onChange={this.onSearchChange}
          />
        </div>
        {this.renderResults()}
      </div>
    )
  }
}
