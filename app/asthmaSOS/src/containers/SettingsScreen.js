import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    Easing,
    Animated
} from 'react-native';

export default class SettingsScreen extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount(){

    }

    render(){
        return(
            <View style={styles.container}>
                <Text>Settings Screen</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})