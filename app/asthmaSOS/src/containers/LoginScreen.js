import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    Easing,
    Animated
} from 'react-native';

import { LoginButton, AccessToken } from 'react-native-fbsdk';

const SERVER_URL = 'http://0.0.0.0:9000'

//const SERVER_URL = process.env.get('SERVER_URL')

export default class LoginScreen extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount(){
        console.log('The following is the FB AccessToken' + JSON.stringify(AccessToken))
        //this._skipLoginIfAlreadyAuth()
    }

    _skipLoginIfAlreadyAuth = async () => {
        const fbToken = await AsyncStorage.getItem('fbToken')
        console.log('The following is the token')
        console.log(fbToken)

        if (fbToken) {
            this.props.navigation.navigate('MainTabs')
        }

    }

    _signInAsync = async (fbToken) => {
        await AsyncStorage.setItem('fbToken', fbToken);

        fetch(SERVER_URL + '/auth/facebook', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                access_token: fbToken
            }),
        })
            .then((response) => response.json())
            .then(async (user) => {
                await AsyncStorage.setItem('jwtToken', user.token)
                this.props.navigation.navigate('MainTabs');
            })
            .catch((error) => {
                console.error(error);
            });

    }

    render(){

        console.log(JSON.stringify(AccessToken))
        return(
            <View style={styles.container}>
                <LoginButton
                    onLoginFinished={
                        (error, result) => {
                            if (error) {
                                alert("login has error: " + result.error);
                            } else if (result.isCancelled) {
                                alert("login is cancelled.");
                            } else {
                                AccessToken.getCurrentAccessToken().then(
                                    (data) => {
                                        console.log(JSON.stringify(data))
                                        this._signInAsync(data.accessToken)
                                    }
                                )
                            }
                        }
                    }
                    onLogoutFinished={() => this.props.navigation.navigate('Login')}/>
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