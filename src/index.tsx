// @ts-nocheck
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import SettingsContext from './contexts/SettingsContext';
import { UnreadProvider } from './contexts/UnreadContext';
import App from './App';
import './css/global.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <SettingsContext>
        <UnreadProvider>
          <App />
        </UnreadProvider>
      </SettingsContext>
    </BrowserRouter>
  </Provider>
);