import { createStore, applyMiddleware, compose } from 'redux';
import storage from 'redux-persist/es/storage';
import { createLogger } from 'redux-logger';
import reducers from './app/reducers';
import { persistStore, persistCombineReducers } from 'redux-persist';

const reducer = persistCombineReducers({ key: 'root', storage }, reducers);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares = [];

// Only use redux-logger in development
if (process.env.NODE_ENV === 'development') {
  middlewares.push(createLogger());
}

const store = createStore(
  reducer,
  {},
  composeEnhancers(applyMiddleware(...middlewares))
);
const persistor = persistStore(store);

export { store, persistor };