import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    Easing,
    Animated
} from 'react-native';


const PARAMETERS_LOOKUP = {
    'o3': 'Ozone',
    'no2': 'Nitrogen Dioxide',
    'co': 'Carbon Monoxide',
    'bc': 'Black Carbon',
    'so2': 'Sulfur Fioxide',
    'pm10': 'PM10',
    'pm25': 'PM2.5'
}

// OZONE 0-50 good,  51-100, 101-150, 151-200, 201-250, 251-300, 301-500 VERY BAD
// SULFUR DIOXIDE 0-0.1 good, 0.1-0.2, 0.2-1.0, 1.0-3.0, 3.0-5.0, 5.0-more VERY BAD
// NITROGEN DIOXIDE 0-50 good, 51-100, 101-150, 151-200, 201-300 VERY BAD
// CARBON MONOXIDE 0-2.9 very good, 3.0-5.8, 5.9-8.9, 9.0-13.4, 13.5-greater VERY BAD
// BLACK CARBON
const LEVELS_LOOKUP = {
    'o3': [0, 50, 100, 150, 200],
    'no2': [0, 50, 100, 150, 200],
    'co': [0, 3.0, 5.8, 8.9, 13.4],
    'bc': [0, 100, 200, 300, 400],
    'so2': [0, 0.1, 0.2, 1.0, 3.0]
}
const COLOR_LEVELS = ['green', 'yellow', 'orange', 'red', 'black']

const getToxicityLevel = (value, parameterKey) => {
    let i=0
    for(;i<COLOR_LEVELS.length;)
        if (value > LEVELS_LOOKUP[parameterKey][i])
            i++
        else
            break
    return --i
}

const PollutionTextValue = ({measurement}) => (
    <View style={{flexDirection: 'row'}}>
        <View style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: COLOR_LEVELS[getToxicityLevel(measurement['value'], measurement['parameter'])]
        }}/>
        <Text style={styles.parameterStyle}>{PARAMETERS_LOOKUP[measurement.parameter]}</Text>
    </View>
)

export default class ExplorerScreen extends Component {
    constructor(props) {
        super(props)

        this.state = ({
            values: []
        })
    }

    componentDidMount(){
        this.setState({values: []})
        this._getPollutionValues()
    }

    _getPollutionValues = () => {
        navigator.geolocation.getCurrentPosition(
            (location) => {
                console.log(JSON.stringify(location))
                const pollutionApiUrl = 'https://api.openaq.org/v1/latest?radius=3000&coordinates=' +
                    parseFloat(location.coords.latitude).toFixed(2) + ',' +
                    parseFloat(location.coords.longitude).toFixed(2)

                console.log(pollutionApiUrl)

                fetch(pollutionApiUrl, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                })
                    .then((response) => response.json())
                    .then((values) => {
                        console.log(JSON.stringify(values['results'][0]['measurements']))
                        this.setState({
                            values: values['results'][0]['measurements']
                        })
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        )
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerStyle}>
                        Level of risk in the air
                    </Text>
                </View>
                {this.state.values.map(measurement => <PollutionTextValue measurement={measurement}/>)}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingBottom: 40
    },
    headerStyle: {
        fontSize: 22
    },
    headerContainer: {
        width: '100%',
        height: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },
    valuesContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    colorIndicatorContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    parameterStyle: {
        fontSize: 18
    }
})