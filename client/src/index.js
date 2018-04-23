import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { initializeServiceWorkers } from './workbox'
import store from './store'
import App from './app'


const render = () => {
  ReactDOM.render(
    (
      <Provider store={store}>
        <App />
      </Provider>
    ),
    // eslint-disable-next-line
    document.getElementById('root'),
  )
}

render()
initializeServiceWorkers()

if (module.hot) {
  module.hot.accept()
}
