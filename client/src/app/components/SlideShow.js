import React, { Component } from 'react'
import FAIcon from 'react-fontawesome';

export default class SlideShow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0
    }

    this.onClickLeft = this.onClickLeft.bind(this);
    this.onClickRight = this.onClickRight.bind(this);
  }

  onClickLeft() {
    const { index } = this.state;
    const { children } = this.props;

    if (index-1 < 0) {
      this.setState({ index: children.length-1 });
    } else {
      this.setState({ index: index-1 });
    }
  }

  onClickRight() {
    const { index } = this.state;
    const { children } = this.props;

    if (index+1 > children.length-1) {
      this.setState({ index: 0 });
    } else {
      this.setState({ index: index+1 });
    }
  }

  renderChild() {
    const { index } = this.state;

    return this.props.children[this.state.index];
  }

  renderLabel() {
    const { index } = this.state;

    if(!this.props.labels || index > this.props.labels.length-1) {
      return index;
    }

    return this.props.labels[this.state.index];
  }

  render() {
    const { children } = this.props;

    if(children && children.length > 0) {
      return (
        <div className="sshow_container">
          <div
            onClick={this.onClickLeft}
            title="Previous"
            className="sshow_left"
          >
            <FAIcon name="chevron-left" />
          </div>
          {this.renderChild()}
          <div
            onClick={this.onClickRight} 
            title="Next"
            className="sshow_right"
          >
            <FAIcon name="chevron-right" />
          </div>
          <div
            className="sshow_label"
          >
            {this.renderLabel()}
          </div>
        </div>
      )
    }
    
    return null;
  }
}
