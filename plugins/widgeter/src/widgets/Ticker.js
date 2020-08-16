import React, { PureComponent } from 'react'

import { Modes } from '../models';
import { getStockDataKey } from '../services';

export default class Ticker extends PureComponent {
  static defaultProps = {
    mode: 'DEFAULT'
  };

  constructor(props) {
    super(props);

    this.state = {
      editedTicker: '',
      ticker: null,
      data: null,
      loading: false,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { editedTicker } = this.state;
    if (this.props.mode !== Modes.EDIT && editedTicker.length && prevState.ticker !== editedTicker) {
      this.setState({ data: [], loading: true, ticker: editedTicker }, async () => {
        const data = await getStockDataKey(editedTicker, 'Price');
        this.setState({ data, loading: false });
      })
    }
  }

  componentDidMount() {
    const { ticker } = this.state;

    if (ticker) {
      this.setState({ loading: true }, async () => {
        const data = await getStockDataKey(ticker, 'Price');
        this.setState({ data, loading: false });
      });
    }
  }

  renderData() {
    
    const { loading, ticker, data } = this.state;

    let spinner = null; 
      if (loading) {
        spinner = <span className="spinner" />;
      } else if (data) {
        let className = '';
        if (data.perf !== undefined && data.perf !== null) {
          className = data.perf ? 'good' : 'bad';
        }
        spinner =  <span className={className}>{data.type}</span>
      }
      const tickerS = ticker ? ticker : '-';
      return <h3>{tickerS}{spinner}</h3>;
  }

  renderEdit() {
    const { mode } = this.props;

    if (mode === Modes.EDIT) {
      return (
        <div className="edit">
          <input
            type="text"
            value={this.state.editedTicker}
            onChange={(e) => this.setState({ editedTicker: e.target.value })}
          />
        </div>
      );
    }
  }

  render() {
    return (
      <div className="ticker">
        {this.renderEdit()}
        {this.renderData()}
      </div>
    )
  }
}
