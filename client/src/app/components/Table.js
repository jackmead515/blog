import React, { Component } from 'react'

export default class Table extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.children.length !== nextProps.children.length ||
      this.props.headings.length !== nextProps.headings.length;
  }

  renderHeadings() {
    const { headings } = this.props;

    return (
      <tr>
        {headings.map((heading, i) => {
          return <th key={`th-${i}`}>{heading}</th>
        })}
      </tr>
    );
  }

  renderChildren() {
    const { children, headings } = this.props;
    const hlength = headings.length;

    const jsx = [];
    for(let i = 0; i < children.length; i+=hlength) {
      const tds = [];
      for (let x = i; x < i+hlength; x++) {
        tds.push(<td key={`td-${x}`}>{children[x]}</td>)
      }
      jsx.push(<tr key={`tr-${i}`}>{tds}</tr>);
    }

    return jsx;
  }

  render() {
    return (
      <table>
        {this.renderHeadings()}
        {this.renderChildren()}
      </table>
    )
  }
}
