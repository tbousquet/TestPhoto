// App.js

import React from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import LevelNavigator from './Navigation'
import { withAuthenticator } from 'aws-amplify-react-native'

class App extends React.Component {
  render() {
    return (
      <LevelNavigator />
    )
  }
}

//export default App
export default withAuthenticator(App)
