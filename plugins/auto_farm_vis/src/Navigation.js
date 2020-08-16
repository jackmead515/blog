import React, { Component } from 'react'

export default class Navigation extends Component {
  constructor(props) {
    super(props);

    this.onClickForward = this.onClickForward.bind(this);
    this.onClickBackward = this.onClickBackward.bind(this);
  }

  onClickForward() {

  }

  onClickBackward() {

  }

  render() {
    return (
      <div className="nav">
        <div className="nav_title">
          <span>farm</span><p>{'1234-567890-1234'}</p>
        </div>
        <div className="buttons">
          <button onClick={this.onClickBackward}>{"<"}</button>
          <button onClick={this.onClickForward}>{">"}</button>
        </div>
      </div>
    )
  }
}
