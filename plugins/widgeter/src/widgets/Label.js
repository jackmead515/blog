import React, { PureComponent } from 'react'

import { Modes } from '../models';

export default class Label extends PureComponent {
  static defaultProps = {
    mode: 'DEFAULT'
  };

  constructor(props) {
    super(props);

    this.state = {
      editedLabel: '',
      label: 'LABEL'
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { editedLabel } = this.state;
    if (this.props.mode !== Modes.EDIT && editedLabel.length && prevState.label !== editedLabel) {
      this.setState({ label: editedLabel });
    }
  }

  renderLabel() {
    const { mode } = this.props;
    const { label } = this.state;

    if (mode !== Modes.EDIT) {
      return label;
    } else {
      return (
        <input
          type="text"
          value={this.state.editedLabel}
          onChange={(e) => this.setState({ editedLabel: e.target.value })}
        />
      );
    }
  }

  render() {
    return (
      <div className="label">
        {this.renderLabel()}
      </div>
    )
  }
}
