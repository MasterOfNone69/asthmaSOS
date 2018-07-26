/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

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

import {
    createStackNavigator,
    createBottomTabNavigator
} from 'react-navigation'

import { Icon } from 'react-native-elements'

import LoginScreen from './src/containers/LoginScreen'
import EmergencyScreen from './src/containers/EmergencyScreen'
import ProfileScreen from './src/containers/ProfileScreen'
import SettingsScreen from './src/containers/SettingsScreen'
import EducationScreen from './src/containers/EducationScreen'
import ExplorerScreen from './src/containers/ExplorerScreen'


const MainTabsScreen = createBottomTabNavigator(
    {
        Emergency: {
            screen: EmergencyScreen,
            navigationOptions: {
                tabBarIcon: <Icon
                    name='new'
                    type='entypo'
                    color='rgba(255,255,255,.9)'
                />
            }
        },
        Profile: {
            screen: ProfileScreen,
            navigationOptions: {
                tabBarIcon: <Icon
                    name='user'
                    type='entypo'
                    color='rgba(255,255,255,.9)'
                />
            }
        },
        Explorer: {
            screen: ExplorerScreen,
            navigationOptions: {
                tabBarIcon: <Icon
                    name='cog'
                    type='entypo'
                    color='rgba(255,255,255,.9)'
                />
            }
        },
        Education: {
            screen: EducationScreen,
            navigationOptions: {
                tabBarIcon: <Icon
                    name='blackboard'
                    type='entypo'
                    color='rgba(255,255,255,.9)'
                />
            }
        }
    },
    {
        initialRouteName: 'Emergency',
        tabBarOptions: {
            tabStyle: {
                backgroundColor: 'green'
            },
            labelStyle: {
                color: 'white'
            }
        }
    }
)

const AppNavigator = createStackNavigator(
    {
        Login: {screen: LoginScreen},
        MainTabs: {screen: MainTabsScreen}
    },
    {
        initialRouteName: 'Login',
        headerMode: 'none',
        transitionConfig: () => ({
            transitionSpec: {
                duration: 0,
                timing: Animated.timing,
                easing: Easing.step0
            }
        })
    }
)

export default class App extends Component {
    render() {
        return (
            <AppNavigator />
        )
    }
}

const styles = StyleSheet.create({
  loginContainer: {
      flex:1,
      alignItems:'center',
      justifyContent: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});