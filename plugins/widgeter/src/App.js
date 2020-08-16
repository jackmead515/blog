import React, { Component } from 'react'
import { Responsive, WidthProvider} from "react-grid-layout";

import { WidgetTypes, Modes } from './models';

import Menu from './Menu';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: 'DEFAULT',
      items: [],
      itemCounter: 0,
      gridProperties: {
        breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
        cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
        rowHeight: 25,
        colWidth: 25,
        isDraggable: false,
        isResizable: false,
        onLayoutChange: function() {},
      }
    };

    this.onItemAdd = this.onItemAdd.bind(this);
    this.onItemRemove = this.onItemRemove.bind(this);
    this.onChangeMode = this.onChangeMode.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
  }

  onItemAdd(type) {
    const { itemCounter, items } = this.state; 
    const defaults = WidgetTypes[type];
    if (defaults) {
      const newItemCounter = itemCounter + 1;
      items.push({
        settings: { 
          ...defaults.settings, 
          type, 
          i: newItemCounter.toString()
        },
        Component: defaults.Component,
      });

      this.setState({
        items,
        itemCounter: newItemCounter
      });
    }
  }

  onItemRemove(index) {
    const { items } = this.state;
    items.splice(index, 1);
    this.setState({ items });
  }

  onChangeMode(checked) {
    const { gridProperties } = this.state;
    if (checked) {
      gridProperties.isDraggable = true;
      gridProperties.isResizable = true;
      this.setState({ mode: Modes.EDIT, gridProperties });
    } else {
      gridProperties.isDraggable = false;
      gridProperties.isResizable = false;
      this.setState({ mode: Modes.DEFAULT, gridProperties });
    }
  }

  onLayoutChange(layout) {
    this.state.gridProperties.onLayoutChange(layout);
  }

  renderWidgets() {
    const { items, mode } = this.state;

    let widgetClasses = 'widget';
    if (mode === Modes.DEFAULT) {
      widgetClasses += ' react-control-hide';
    }

    return items.map((item, i) => {
      return (
        <div
          className={widgetClasses}
          key={item.settings.i}
          data-grid={item.settings}
        >
          <div
            className="react-remove-handle"
            onClick={() => this.onItemRemove(i)}
          >
            x
          </div>
          <item.Component mode={mode} />
        </div>
      );
    });
  }

  

  render() {
    return (
      <div className="container">
        <Menu
          onItemAdd={this.onItemAdd}
          onChangeMode={this.onChangeMode}
        />
        <div className="layout">
          <ResponsiveGridLayout
            onLayoutChange={this.onLayoutChange}
            {...this.state.gridProperties}
          >
              {this.renderWidgets()}
          </ResponsiveGridLayout>
        </div>
      </div>
    )
  }
}
