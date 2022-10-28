import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from "@ethersproject/providers";
import createSagaMiddleware from 'redux-saga';
import { applyMiddleware, compose, createStore } from 'redux';
import { rootReducer } from './store/reducer';
import { rootSaga } from './store/saga';
import { Provider } from 'react-redux';

var win = window as any;
const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = win.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));
sagaMiddleware.run(rootSaga);


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

function getLibrary(provider: any): Web3Provider {
  const lib = new Web3Provider(provider);
  lib.pollingInterval = 12000;
  return lib;
}


root.render(
  // <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary} >
      <Provider store={store}>
        <App />
      </Provider>
    </Web3ReactProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
