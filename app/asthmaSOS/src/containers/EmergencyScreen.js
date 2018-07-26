import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    Easing,
    Animated,
    FlatList,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Image
} from 'react-native';

import { Button, Icon } from 'react-native-elements'

import call from 'react-native-phone-call'

const SERVER_URL = 'http://0.0.0.0:9000'

//'google-maps'   'facebook-messenger'   'phone'


const WIDTH = Dimensions.get('window').width

import { openMap, createOpenLink} from 'react-native-open-maps'

const executeAction = (uri) => {
    //HERE THERE WILL BE A POST CALL
    console.log('Action executed with the following URI: ' + uri)
}

const lookForNearbyPharmacyAndHospital = (coords) => {
    //openMap({ latitude: 37.865101, longitude: -119.538330 })
    navigator.geolocation.getCurrentPosition(
        (location) => {
            console.log('The following is the location')
            console.log(JSON.stringify(location))
            createOpenLink({
                latitude: location.latitude,
                longitude: location.longitude,
                query: "pharmacy hospitals asthma",
                zoom: 16,
                provider: 'google'
            })()
        }
    )
}

const callUser = (phone) => {
    console.log('callUser called')
    call({
        number: phone,
        prompt:false
    }).catch(console.error)
}

const SingleSolution = ({text, coords, icon}) => (
    <TouchableOpacity activeOpacity={0.8} onPress={() => lookForNearbyPharmacyAndHospital(coords)}>
        <View style={styles.singleSolutionContainer}>
            <View style={styles.singleSolutionInnerContainer}>
                <View style={styles.singleSolutionIconContainer}>
                    <Icon
                        name={icon}
                        type='material-community'
                        color='rgba(255,255,255,.9)'
                    />
                </View>
                <View style={styles.singleSolutionTextContainer}>
                    <Text style={styles.singleSolutionTextStyle}>{text}</Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>
)

const UserNearby = ({picture, name, phone, id}) => (
    <TouchableOpacity activeOpacity={0.8} onPress={() => callUser(phone)}>
        <View style={styles.singleSolutionContainer}>
            <View style={styles.singleSolutionInnerContainer}>
                <View style={styles.singleSolutionIconContainer}>
                    <Image source={{uri: picture}} style={{width: 80, height: 80, borderRadius: 8}}/>
                </View>
                <View style={styles.singleSolutionTextContainer}>
                    <Text style={styles.singleSolutionTextStyle}>{name}</Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>
)

export default class EmergencyScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            usersNearby: [],
            placesNearby: [],
            familyFriends: []
        }

        this.jwtToken = undefined
    }

    _sendUserPosition = () => {
        navigator.geolocation.getCurrentPosition(
            (location) => {
                fetch(SERVER_URL + '/users/refresh-position', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.jwtToken}`
                    },
                    body: JSON.stringify({
                        location
                    }),
                })
                    .then((response) => {})
                    .catch((error) => {
                        console.error(error);
                    });
            },
            (error) => console.log('Error on getting the GPS position')
        )
    }

    componentDidMount(){
        this._retrieveToken()
        this.sendUserPositionContinuously = setInterval(
            this._sendUserPosition,
            20000
        )
    }

    componentWillUnmount(){
        clearInterval(this.sendUserPositionContinuously)
    }

    _retrieveFamilyFriends = () => {
        AsyncStorage.getItem('familyFriends', (err, familyFriends) => {
            if(familyFriends)
                this.setState({
                    familyFriends: JSON.parse(familyFriends)
                })
        })
    }

    _retrieveToken = async () => {
        this.jwtToken = await AsyncStorage.getItem('jwtToken')
    }

    _renderSolutionsList = () => {
        return(
            <View style={styles.solutionsContainer}>
                <View style={styles.solutionsHeaderContainer}>
                    <Text style={styles.solutionsHeaderStyle}>Available To Help You</Text>
                </View>
                <View style={styles.solutionsInnerContainer}>
                    <ScrollView>
                        {
                            <SingleSolution text='Nearby Hospitals and Pharmacies'
                                            coords={[10, 10]}
                                            icon='google-maps'
                            />
                        }
                        {
                            this.state.usersNearby ? this.state.usersNearby.map(userNearby =>
                                <UserNearby name={userNearby.name}
                                            picture={userNearby.picture}
                                            phone={userNearby.phone}
                                            id={userNearby.id}
                                />
                            ) : null
                        }
                        {
                            this.state.familyFriends ? this.state.familyFriends.map(familyFriend =>
                                <UserNearby name={familyFriend.name}
                                            picture={familyFriend.picture}
                                            phone={familyFriend.phone}
                                            id={familyFriend.id}
                                />
                            ) : null
                        }
                    </ScrollView>

                </View>
                <View style={styles.clearContainer}>
                    <Button title='Clear'
                            buttonStyle={styles.clearButtonStyle}
                            titleStyle={styles.clearTitleStyle}
                            onPress={() => {
                                this.setState({
                                    usersNearby: [],
                                    placesNearby: [],
                                    familyFriends: []
                                })}
                            }
                    />
                </View>
            </View>
        )
    }

    _emitEmergencyAlert = async () => {
        const fbToken = await AsyncStorage.getItem('fbToken')
        if(!fbToken){
            //put an error message here
            return null
        }

        navigator.geolocation.getCurrentPosition(
            (location) => {
                fetch(SERVER_URL + '/users/emergency-alert', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.jwtToken}`
                    },
                    body: JSON.stringify({
                        location,
                        fbToken
                    }),
                })
                    .then((response) => response.json())
                    .then((solutions) => {
                        console.log(JSON.stringify(solutions))
                        this.setState({usersNearby: solutions.usersNearby})
                        this._retrieveFamilyFriends()
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            },
            (error) => console.log('Error')
        )
    }

    render(){
        return(
            <View style={styles.container}>
                { (this.state.usersNearby.length > 0 ||
                    this.state.placesNearby.length > 0 ||
                    this.state.familyFriends.length > 0
                ) ? (
                   this._renderSolutionsList()
                ) : (
                    <View style={styles.emergencyButtonContainer}>
                        <Button
                            title={`Press\nTo\nAsk\nHelp!`}
                            buttonStyle={{
                                width: 200,
                                height: 200,
                                backgroundColor: 'red',
                                borderRadius: 20,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            textStyle={{
                                fontWeight: 'bold',
                                fontSize: 22,
                                textAlign: 'center'
                            }}
                            onPress={() => this._emitEmergencyAlert()}
                        />
                    </View>
                )}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 30
    },
    emergencyButtonContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    solutionsContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    solutionsInnerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    solutionsHeaderContainer: {
        width: WIDTH,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },
    solutionsHeaderStyle: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'green'
    },
    singleSolutionContainer: {
        width: WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
        marginBottom: 4
    },
    singleSolutionTextStyle: {
        fontSize: 16,
    },
    solutionsListContainer: {
        width: WIDTH
    },
    clearContainer: {
        margin: 20,
    },
    clearButtonStyle: {
        width: 160,
        height: 40,
        backgroundColor: 'grey',
        borderRadius: 8
    },
    clearTitleStyle: {
        fontSize: 16,
    },
    singleSolutionInnerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: WIDTH*0.86,
        minHeight: 60,
        borderRadius: 8,
        paddingRight: 12,
        paddingLeft: 12,
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,1)',
        flexDirection: 'row'
    },
    singleSolutionIconContainer: {
        flex:1,
    },
    singleSolutionTextContainer: {
        flex: 7,
        alignItems: 'center',
        justifyContent: 'center'
    }
})