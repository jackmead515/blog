import Ticker from './widgets/Ticker';
import Label from './widgets/Label';
import Stock from './widgets/Stock';
import BlogStats from './widgets/BlogStats';
import Plugin from './widgets/Plugin';

export const WidgetTypes = {
  TICKER: {
    settings: { x: 0, y: 0, w: 1, h: 2, minW: 1, minH: 1 },
    Component: Ticker,
  },
  LABEL: {
    settings: { x: 0, y: 0, w: 3, h: 2, minW: 1, minH: 1 },
    Component: Label,
  },
  STOCK: {
    settings: { x: 0, y: 0, w: 5, h: 5, minW: 1, minH: 1 },
    Component: Stock,
  },
  STATS: {
    settings: { x: 0, y: 0, w: 5, h: 5, minW: 1, minH: 1 },
    Component: BlogStats,
  },
  PLUGIN: {
    settings: { x: 0, y: 0, w: 5, h: 5, minW: 1, minH: 1 },
    Component: Plugin,
  }
};

export const Modes = {
  EDIT: 'EDIT',
  DEFAULT: 'DEFAULT',
}


