import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './app/layout/App';
import ScrollToTop from './app/layout/ScrollToTop';
import 'react-toastify/dist/ReactToastify.min.css';
import './app/layout/style.css';
import 'react-calendar/dist/Calendar.css';
import configureStore from './app/store/configureStore';
import { loadEvents } from './features/events/eventActions';

const store = configureStore();

store.dispatch(loadEvents());

const rootEl = document.getElementById('root');

function render() {
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop />
        <App />
      </BrowserRouter>
    </Provider>,
    rootEl
  );
}

if (module.hot) {
  module.hot.accept('./app/layout/App', function () {
    setTimeout(render);
  });
}

render();
