import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';
import AutoSizer from 'react-virtualized-auto-sizer';

function createCodeSource(props) {
  const { language, source } = props;
  return `
  \`\`\`${language}
  ${source}
  \`\`\`
  `
}

export default class Code extends Component {
  render() {
    return (
      <div className="code_container">
        <AutoSizer disableHeight>
          {({ width }) => (
            <div className="code_wrapper" style={{width, maxWidth: width}}>
              <ReactMarkdown
                source={createCodeSource(this.props)}
                renderers={{code: CodeBlock}}
              />
            </div>
          )}
        </AutoSizer>
      </div>
    )
  }
}
