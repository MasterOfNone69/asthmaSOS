import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    Easing,
    Animated,
    Image,
    TextInput,
    ScrollView
} from 'react-native';

import { Button } from 'react-native-elements'

const SERVER_URL = 'http://0.0.0.0:9000'

export default class ProfileScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            picture: 'https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?auto=compress&cs=tinysrgb&h=350',
            mame: 'Eugenio Galioto',
            phone: '',
            email: '',
            tmpFamilyFriendName: '',
            tmpFamilyFriendPhone: '',
            familyFriends: []
        }
    }

    componentDidMount(){
        this._retrieveFamilyFriends()
        this._retrieveProfile()
    }

    _retrieveProfile = async () => {
        //THIS WAY WE GET THE PROFILE WITH ALL THE BASIC INFO

        await AsyncStorage.getItem('jwtToken', (err, jwtToken) => {
            fetch(SERVER_URL + '/users/me', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`
                },
            })
                .then((response) => response.json())
                .then((profile) => {
                    console.log(JSON.stringify(profile))
                    this.setState({
                        phone: profile.phone,
                        name: profile.name,
                        picture: profile.picture,
                        email: profile.email

                    })
                })
                .catch((error) => {
                    console.error(error);
                });
        })
    }

    _updateProfile = async () => {
        await AsyncStorage.getItem('jwtToken', (err, jwtToken) => {
            fetch(SERVER_URL + '/users/me', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`
                },
                body: JSON.stringify({
                    phone: this.state.phone,
                    email: this.state.email
                }),
            })
                .then((response) => {
                    if(!response.ok){
                        console.error('An error occurred')
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        })
    }

    _retrieveFamilyFriends = () => {
        AsyncStorage.getItem('familyFriends', (err, familyFriends) => {
            if(familyFriends)
                this.setState({familyFriends: JSON.parse(familyFriends)})
        })
    }

    _addFamilyFriend = () => {
        if(this.state.tmpFamilyFriendName.length > 0 &&
            this.state.tmpFamilyFriendPhone.length > 0
        ){
            AsyncStorage.getItem('familyFriends', (err, familyFriends) => {
                if(!familyFriends)
                    familyFriends = []
                else
                    familyFriends = JSON.parse(familyFriends)

                familyFriends.push({
                    name: this.state.tmpFamilyFriendName,
                    phone: this.state.tmpFamilyFriendPhone
                })

                AsyncStorage.setItem('familyFriends', JSON.stringify(familyFriends))

                console.log('_addFamilyFriend -- familyFriends')
                console.log(JSON.stringify(familyFriends))

                this.setState({
                    familyFriends,
                    tmpFamilyFriendName: '',
                    tmpFamilyFriendPhone: ''
                })
            })
        }
    }

    _deleteFamilyFriend = (phone) => {
        AsyncStorage.getItem('familyFriends', (err, familyFriends) => {
            let indexToDelete = undefined

            if (!familyFriends)
                return;

            familyFriends = JSON.parse(familyFriends)

            for (let i = 0; i < familyFriends.length; i++)
                if (familyFriends[i].phone === phone) {
                    indexToDelete = i
                    break
                }

            if (indexToDelete === undefined)
                return;

            familyFriends = [
                ...familyFriends.slice(0, indexToDelete),
                ...familyFriends.slice(indexToDelete + 1,)
            ]

            AsyncStorage.setItem('familyFriends', JSON.stringify(familyFriends))

            this.setState({familyFriends})
        })
    }

    _renderFamilyFriends = () => this.state.familyFriends.map(familyFriend => (
            <View style={styles.familyFriendContainer}>
                <View style={styles.familyFriendTextContainer}>
                    <Text style={styles.familyFriendTextStyle}>
                        {familyFriend.name} -- {familyFriend.phone}
                    </Text>
                </View>
                <Button title='Delete'
                        buttonStyle={{
                            width: 160,
                            height: 40,
                            backgroundColor: 'gray',
                            borderBottomRightRadius: 8,
                            borderBottomLeftRadius: 8
                        }}
                        onPress={() => this._deleteFamilyFriend(familyFriend.phone)}
                />
            </View>
        )
    )



    render(){
        return(
            <View style={styles.container}>
                <ScrollView style={{width: '100%'}}>
                <View style={styles.namePictureContainer}>
                    <Image source={{uri: this.state.picture}}
                           style={{
                               width: 100,
                               height: 100,
                               borderRadius: 50,
                               borderWidth: 1,
                               borderColor: 'white'
                           }}
                    />
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 22,
                        marginTop: 6
                    }}>{this.state.name}</Text>
                </View>

                <View style={styles.profileInfoContainer}>
                    <View style={styles.profileInfoHeaderContainer}>
                        <Text style={styles.profileInfoHeaderStyle}>
                            Edit your profile info here
                        </Text>
                    </View>

                    <View style={styles.profileInfoFormContainer}>
                        <TextInput
                            style={{
                                height: 40,
                                borderColor: 'gray',
                                borderWidth: 1,
                                width: 300,
                                borderRadius: 8,
                                margin: 4
                            }}
                            placeholder='Phone'
                            onChangeText={(phone) => this.setState({phone})}
                            value={this.state.phone}
                        />
                        <TextInput
                            style={{
                                height: 40,
                                borderColor: 'gray',
                                borderWidth: 1,
                                width: 300,
                                borderRadius: 8,
                                margin: 4
                            }}
                            placeholder='Email'
                            onChangeText={(email) => this.setState({email})}
                            value={this.state.email}
                        />
                    </View>
                </View>

                <View style={styles.updateProfileButtonContainer}>
                    <Button title='Update Profile'
                            buttonStyle={{
                                width: 160,
                                height: 40,
                                backgroundColor: 'green',
                                borderRadius: 8,
                                marginTop: 20,
                                marginBottom: 20
                            }}
                            onPress={() => this._updateProfile()}
                    />
                </View>

                <View style={styles.addFamilyFriendsContainer}>
                    {
                        (this.state.familyFriends.length > 0) ? this._renderFamilyFriends() : null
                    }
                    <View style={{width: '100%', height: 40}}/>
                    <TextInput
                        style={{
                            height: 40,
                            borderColor: 'gray',
                            borderWidth: 1,
                            width: 300,
                            borderRadius: 8,
                            margin: 4
                        }}
                        placeholder='Name'
                        onChangeText={(tmpFamilyFriendName) => this.setState({tmpFamilyFriendName})}
                        value={this.state.tmpFamilyFriendName}
                    />
                    <TextInput
                        style={{
                            height: 40,
                            borderColor: 'gray',
                            borderWidth: 1,
                            width: 300,
                            borderRadius: 8,
                            margin: 4
                        }}
                        placeholder='Phone'
                        onChangeText={(tmpFamilyFriendPhone) => this.setState({tmpFamilyFriendPhone})}
                        value={this.state.tmpFamilyFriendPhone}
                    />
                    <Button title='Add'
                            onPress={() => this._addFamilyFriend()}
                            buttonStyle={{
                                width: 160,
                                height: 40,
                                backgroundColor: 'green',
                                borderRadius: 8,
                                marginTop: 4,
                                marginBottom: 20
                            }}
                    />
                </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    namePictureContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40
    },
    profileInfoContainer: {
        width: '100%',
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileInfoHeaderContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    profileInfoHeaderStyle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    profileInfoFormContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    updateProfileButtonContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    addFamilyFriendsContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    familyFriendContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        marginBottom: 15
    },
    familyFriendTextContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    familyFriendTextStyle: {
        width: '80%',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        height: 40,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: 18
    }

})