import React, { Component } from 'react'
import { View, Text, Dimensions, Animated, Platform } from 'react-native'
import { accelerometer, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";

import styles, { HOLE_WIDTH } from './styles.css'

setUpdateIntervalForType(SensorTypes.accelerometer, 1000); // defaults to 100ms

class App extends Component {
    /* props
    children - string
    anim
    hackref - object
    */
    state = {
        x: 0,
        y: 0,
        z: 0
    }
    constructor(props) {
        super(props);
        this.left = 901;
        this.props.getLeft = () => this.left;
        this.props.stop = this.stop;
        this.props.start = this.start;
        this.start();
    }
    componentWillUnmount() {
        this.stop();
    }
    handleAccel = ({x, y, z}) => { // bind untested
        this.setState(()=>({x,y,z}));
    }
    start = () => { // bind untested
        this.accel = accelerometer.subscribe(({ x, y, z}) =>
          console.log({x,y,z},Math.atan(z/y)))
    }
    stop = () => { // bind untested
        this.accel.unsubscribe();
    }
    render() {
        const { x, y, z } = this.state;
        let { width, height } = Dimensions.get('window');
        const portrait = width > height ? false : true;

        // if (!portrait && Platform.OS === 'android') {
        //     // because in landscape, android puts the statusbar on the right side of the screen
        //     width -= getStatusBarHeight() * 2;
        // }

        let info_el;

        if (this.left === 901) {
            const center = (width / 2) - (HOLE_WIDTH / 2);
            this.left = Math.round(center);
        } else {
            if (x !== 0 && y !== 0 && z !== 0) {
                const roll = Math.atan2(y, z) * 57.3
                const pitch = Math.atan2((-1*x) , Math.pow((y * y) + (z * z), 0.5)) * 57.3;

                const tilt = portrait ? pitch : roll; // portrait ? x : y;

                const inverse_landscape = !portrait && pitch > 0;
                // const inverse_portrait = portrait && pitch < 0; // doesnt work, and i cant get a inverse portrait orientation
                let inverse_portrait;
                if (Platform.OS === 'ios') {
                    inverse_portrait = true;
                } else {
                    inverse_portrait = false;
                }
                // const left_new = this.left + (tilt * (inverse_landscape ? -1 : 1));
                const left_new = this.left + (tilt * (inverse_portrait ? -1 : 1));
                if (left_new < 0) {
                    this.left = 0;
                } else if (left_new > (width - HOLE_WIDTH)) {
                    this.left = width - HOLE_WIDTH;
                } else {
                    this.left = left_new;
                }

                // info_el = [
                //     <Text key="0">Orienation: {portrait ? 'Portrait' : 'Landscape'}</Text>,
                //     <Text key="1">Tilt: {tilt.toFixed(2)}</Text>,
                //     <Text key="2">Roll: {roll.toFixed(2)}</Text>,
                //     <Text key="3">Pitch: {pitch.toFixed(2)}</Text>,
                //     <Text key="4">Accel X: {x.toFixed(2)}</Text>,
                //     <Text key="5">Accel Y: {y.toFixed(2)}</Text>,
                //     <Text key="6">Accel Z: {z.toFixed(2)}</Text>
                // ];
            }
        }
        const styles_tilt = {
            left: this.left
        };
        return (
            <View style={[styles.hole, styles_tilt]}>
                {/*{info_el}*/}
            </View>
        )
    }
}

export default App
