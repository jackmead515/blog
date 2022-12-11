import React from "react";
import { debounceTime, Subject } from 'rxjs';

import * as services from '../../services';
import IconLoader from "../generic/IconLoader";

export default class SearchBar extends React.PureComponent {

    constructor(props) {
        super(props);
    
        this.state = {
            value: '',
            loading: false,
            searchResults: [],
        };

        this.onInputChange = this.onInputChange.bind(this);
        this.resetInput = this.resetInput.bind(this);
        this.inputObservable = new Subject();
    }

    componentDidMount() {
        this.inputObservable
            .pipe(debounceTime(200))
            .subscribe((search) => {
                this.setState({ loading: true }, () => {
                    services.searchBlogs(search)
                        .then((results) => {
                            this.setState({ searchResults: results }, () => {
                                const search = document.getElementById("searchbar__results");
                                if (search) {
                                    search.focus();
                                }
                            });
                        })
                        .finally(() => {
                            this.setState({ loading: false });
                        });
                });
            });
    }

    onInputChange(event) {
        const value = event.target.value;
        this.setState({ value });
        this.inputObservable.next(value);
    }

    resetInput() {
        this.setState({ value: '', searchResults: [] });
    }

    renderSearchResults() {
        const { searchResults } = this.state;

        if (!searchResults.length) {
            return;
        }

        return (
            <div
                id="searchbar__results"
                onBlur={this.resetInput}
                className="searchbar__results">
                {searchResults.map((result, i) => {
                    return <a key={i} href={`/blogs/${result.link}`}>{result.title}</a>
                })}
            </div>
        )
    }

    renderIcon() {
        const { loading } = this.state;

        if (loading) {
            return (
                <div className="searchbar__icon">
                    <IconLoader>&#9762;</IconLoader>
                </div>
            )
        }

        return  (
            <div className="searchbar__icon">
                <span>&#9732;</span>
            </div>
        )
    }

    render() {
        return (
            <div className="searchbar">
                {this.renderSearchResults()}
                {this.renderIcon()}
                <input
                    value={this.state.value}
                    onChange={this.onInputChange}
                />
            </div>
        );
      }

}