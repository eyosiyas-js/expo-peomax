import { registerRootComponent } from 'expo'
import React from 'react'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App'

// Create a new component that wraps App with Provider
const RootComponent = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

// Register RootComponent as the root component
registerRootComponent(RootComponent)
