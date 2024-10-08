import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
import ErrorBoundary from './components/ErrorBoundary';
import ReactModal from 'react-modal';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={configureStore()}>
    <ErrorBoundary>{[<App key='App'/>]}</ErrorBoundary>
  </Provider>
);

ReactModal.setAppElement('#root');

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
