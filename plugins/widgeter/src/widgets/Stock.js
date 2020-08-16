import React, { PureComponent } from 'react'

import moment from 'moment';

import { Modes } from '../models';
import { partition } from '../util';
import { getStockData } from '../services';

const FIVE_MINUTES = 1000 * 60 * 5;

export default class Stock extends PureComponent {
  static defaultProps = {
    mode: 'DEFAULT'
  };

  constructor(props) {
    super(props);

    this.state = {
      editedStock: '',
      stock: null,
      data: [],
      lastUpdated: undefined,
      loading: false,
    }

    this.updateInterval = null;
  }

  componentDidUpdate(prevProps, prevState) {
    const { editedStock, refresh } = this.state;
    if (this.props.mode !== Modes.EDIT && editedStock.length && prevState.stock !== editedStock) {
      this.setState({ data: [], loading: true, stock: editedStock }, async () => {
        const data = await getStockData(editedStock);
        this.setState({ data, loading: false, lastUpdated: moment() });
      })
    } else if (refresh) {
      this.setState({ refresh: false, loading: true }, async () => {
        const data = await getStockData(editedStock);
        this.setState({ data, loading: false, lastUpdated: moment() });
      });
    }
  }

  componentDidMount() {
    this.updateInterval = setInterval(() => {
      if (this.state.stock) {
        this.setState({ refresh: true });
      }
    }, FIVE_MINUTES);
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }

  renderStockData() {
    const { data } = this.state;

    if (data.length) {
      const rows = data.reduce(partition(3), []);
      return (
        <table className="stock-table">
          <tbody>
            {rows.map((row, i) => {
              return (
                <tr key={i}>
                  {row.map((entry, i) => {
                    return (
                      <td key={i}>
                        <div>
                          <span>{entry[0]}</span>
                          <span>{entry[1]}</span>
                        </div>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      )
    }
  }

  renderData() {
    return (
      <div>
        {this.renderStockData()}
      </div>
    );
  }

  renderEdit() {
    const { mode } = this.props;

    if (mode === Modes.EDIT) {
      return (
        <div className="edit">
          <input
            type="text"
            value={this.state.editedStock}
            onChange={(e) => this.setState({ editedStock: e.target.value })}
          />
        </div>
      );
    }
  }

  renderTitle() {
    const { loading, stock, lastUpdated } = this.state;

    let loadingSymbol = <div className="spinner" />;
    if (!loading && lastUpdated) {
      loadingSymbol = <div className="badge">{lastUpdated.fromNow()}</div>
    } else if (!loading) {
      loadingSymbol = null;
    }

    const stockSymbol = stock ? stock : '-';

    return <h3>{stockSymbol}{loadingSymbol}</h3>;
  }

  render() {
    return (
      <div className="stock">
        {this.renderEdit()}
        {this.renderTitle()}
        {this.renderData()}
      </div>
    )
  }
}
