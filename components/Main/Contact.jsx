import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';


import Colors from '../../constants/Colors';

const Contact = props => {
    const contactPressHandler = () => {
        if (props.pressed) {
            props.onPress(false)

        } else {
            props.onPress(true)
        }
    }
    return (
        <TouchableOpacity onPress={contactPressHandler} style={styles.container}>
            <View style={styles.personContainer}>
                {props.image ? <Image source={{ uri: props.image }} style={{ width: 30, height: 30, borderRadius: 100 }} /> : <Image style={{ height: 30, width: 30 }} source={require('../../assets/images/userProfile.png')} />}
                <View style={styles.textContainer}>
                    <Text style={styles.text}>{props.name}</Text>

                </View>
            </View>

            {props.pressed ? <View style={styles.submitButton}>
                <Ionicons name={"md-checkmark"} size={24} color={Colors.accent} style={{ paddingTop: 2 }} />
            </View> : <View style={styles.buttonUnpressed} />}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: '7.5%',
        height: 70,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    personContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%'
    },
    submitButton: {
        alignItems: 'center'
    },
    buttonUnpressed: {
        borderWidth: 1,
        borderRadius: 100,
        height: '30%',
        aspectRatio: 1,
        borderColor: 'gray'
    },
    textContainer: {
        height: '100%',
        width: '85%',

    },
    text: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white'
    },
})

export default Contact;