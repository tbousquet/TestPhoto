// App.js

import React, {useEffect, useState} from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import {accelerometer,
        setUpdateIntervalForType,
        SensorTypes}
        from "react-native-sensors";
import Animated, {useDerivedValue, useSharedValue, useAnimatedStyle, withSpring} from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'

setUpdateIntervalForType(SensorTypes.accelerometer, 10);

const Level = () => {
      const navigation = useNavigation();
      const accelValue = useSharedValue({x:0,y:0,z:0});
      const prev = useSharedValue({x:0,y:0,z:0});
      let test = false
      let res = 0
      let res_test = false

      const deriveTranslations = useDerivedValue(() => {
        const MAX_Y = 260;
        let zAccel = accelValue.value.z

        if (Math.abs(zAccel) < 0.05) {
          zAccel = 0.0
        }
        let newY = MAX_Y*Math.floor(1.5*zAccel*100)/100+100

        if (Math.abs(newY) > MAX_Y) {
          newY = newY/Math.abs(newY)*MAX_Y
        }

        const sect = newY > -160 && newY < -90 ? "true" : "false"
        return (
          {y: newY, section: sect}
        )
      })

      useEffect(() => {
        const subscription = accelerometer.subscribe(({x,y,z}) => {
          accelValue.value = {x,y,z}
          if (deriveTranslations.value.section == "true") {
            res = res + 1
            if (res > 200) {
              navigation.navigate('Test', { subscription: subscription})
            }
          }
          else {
            res = 0
          }
        })

        if (res > 200) {
          return (
            subscription.unsubscribe()
          )
        };
      },[])
        /**return(
          subscription.unsubscribe()
        )**/

      const AnimatedStyle = {
        motion: useAnimatedStyle(() => {
          return({
            transform: [
              {
                translateY: withSpring(deriveTranslations.value.y),
              },
            ],
            flex:1,
            justifyContent: 'center',
            alignItems: 'center'
          })
        }),
        rectangle: useAnimatedStyle(() => {
          return({
            width: 80,
            height: 80,
            borderRadius: 80,
            top: 290,
            position: 'absolute',
            backgroundColor: deriveTranslations.value.section === "true" ? 'green' : 'lightgrey'
          })
        })
      }
      return (
        <View style={styles.main}>
          <Animated.View style={AnimatedStyle.rectangle}>
          </Animated.View>
          <Animated.View style={AnimatedStyle.motion}>
            <View style={styles.test}>
            </View>
          </Animated.View>
          </View>
      )
}


const styles = StyleSheet.create({
  test: {
    backgroundColor: 'red',
    height: 70,
    width: 70,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center'
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default Level
