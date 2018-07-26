import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    Easing,
    Animated,
    ScrollView
} from 'react-native';

export default class EducationScreen extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount(){

    }

    render(){
        return(
            <View style={styles.container}>
                <ScrollView>
                    <Text>{`Tips

Reminder to see your doctor for a check up on the 26th of July.

Know what medicine works best for you
Ask your doctor whether you have to combine inhalers for better control, or additional medication is needed into your asthma program.

Remember! Asthma is triggered by many things, regardless of whether you feel good today make sure to carry your medication with you just in case.

A rescue inhaler is vital, having an action plan of people you can contact on this app reduced the risk of an accident happening. We recommend that your contact list have a readily available rescue inhaler.

Sit with your doctor and family members to work out an action plan. It is absolutely essential to prevent mismanagement.


Learn about your asthma, symptoms include a headache, itchy throat, itchy eyes, runny nose, chest tightness, or anxiety. Have you got them?

Every forth night use a peak flow meter and record your numbers into the app for management.


Meet other asthmatics in the asthma community through this app. `}
                    </Text>
                </ScrollView>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    }
})