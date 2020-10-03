import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, Image } from 'react-native';

// EXTERNAL
import * as Permissions from 'expo-permissions';

// COMPONENTS
import Colors from '../../constants/Colors';

const LocationSetupScreen = ({ navigation }) => {

    const verifyPermissions = async () => {
        //will only run if permissions need to be verified
        const result = await Permissions.askAsync(Permissions.LOCATION);
        if (result.status !== 'granted') {
            Alert.alert('Insufficient permissions!',
                'You need to grant location permissions', [{ text: 'Okay!' }])
            return false;
        }
        navigation.navigate("Contacts")
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.textContainer}>
                <Text style={styles.header}>Let's start with your location</Text>
                <Text style={styles.paragraph}>Crime app uses your location to give your current location a safety rating, and to find crime near you.</Text>
            </View>

            <View style={styles.iconContainer}>
                <Image source={require('../../assets/images/currentLocation.png')} style={{ width: 218, height: 200 }} />

            </View>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={verifyPermissions} style={styles.buttonFiled}><Text style={{ ...styles.buttonText, color: 'white' }}>Allow</Text></TouchableOpacity>
                <TouchableOpacity onPress={verifyPermissions} style={styles.button}><Text style={{ ...styles.buttonText, color: Colors.accent }}>Allow Once</Text></TouchableOpacity>
                <TouchableOpacity onPress={verifyPermissions} style={styles.button}><Text style={{ ...styles.buttonText, color: Colors.accent }}>Don't Allow</Text></TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.primary
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '20%',
        paddingHorizontal: 30
    },
    header: {
        textAlign: 'center',
        color: 'white',
        fontSize: 22,
        fontFamily: 'TTN-Bold'
    },
    paragraph: {
        marginTop: 10,
        textAlign: 'center',
        color: '#C1C1C1',
        fontSize: 18,
        fontFamily: 'TTN-Medium'
    },
    iconContainer: {
        height: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.primary,
        borderRadius: 100,
        shadowColor: 'black',
        shadowOpacity: 0,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
    },
    buttonsContainer: {
        height: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,

    },
    buttonFiled: {

        width: '80%',
        height: '18%',
        backgroundColor: Colors.accent,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOpacity: .2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
    },
    button: {
        marginTop: 15,
        width: '80%',
        height: '18%',
        backgroundColor: Colors.secondary,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 15,
        fontFamily: 'TTN-Bold'
    }

})

export default LocationSetupScreen;