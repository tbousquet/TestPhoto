import React from 'react'
import { Image, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Level from './Level'
import Test from './Test'
import { Auth } from 'aws-amplify'

const Stack = createStackNavigator()

function LevelNavigator() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        screenOptions={{
          headerShown: true
        }}>
        <Stack.Screen
          name ="Level"
          component={Level}
          options = {() => ({
              headerLeft: () => (
                <TouchableOpacity onPress={() => {
                  Auth.signOut()
                }}>
                  <Text> Sign Out </Text>
                </TouchableOpacity>
              )
          })}
        />
        <Stack.Screen
          name = "Test"
          component={Test}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default LevelNavigator;
