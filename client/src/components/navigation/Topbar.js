import React from "react";

export default class Topbar extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
          <div className="topbar">
            <a href="/">Home</a>
            <a href="/about">About</a>
          </div>
        );
      }

}