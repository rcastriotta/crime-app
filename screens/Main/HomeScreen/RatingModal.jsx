import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, SafeAreaView } from 'react-native';

// COMPONENTS
import Colors from '../../../constants/Colors';

// EXTERNAL
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const RatingModal = props => {
    return (
        <Modal transparent={true} visible={props.visible} animationType={"slide"}>
            <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={styles.container}>
                    <View style={{ width: '100%' }}>
                        <Text style={{ ...styles.percentage, color: props.currentColors.main }}>{props.percentage}% Safe</Text>
                        <View style={{ ...styles.ratingBarBackground, backgroundColor: props.currentColors.backgroundColor }}>
                            <View style={{ ...styles.ratingBar, backgroundColor: props.currentColors.main, width: `${props.percentage < 5 ? 6 : props.percentage}%` }} />
                        </View>
                    </View>
                    <Text style={styles.description}>This rating represents a <Text style={{ ...styles.description, color: Colors.accent }}>{props.radius} mi</Text> radius of your current location</Text>
                    <TouchableOpacity activeOpacity={0.7} style={styles.button} onPress={() => props.setVisible()}>
                        <Text style={styles.buttonText}>Okay!</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '36%',
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 30,
        shadowColor: 'black',
        shadowOpacity: .5,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 20,
    },
    percentage: {
        fontFamily: 'TTN-Bold',
        color: 'rgba(41, 214, 128, 1)',
        fontSize: hp('2.5%')

    },
    ratingBarBackground: {
        height: 15,
        width: '100%',
        borderRadius: 100,
        backgroundColor: 'rgba(41, 214, 128, .15)',
        marginTop: '5%'
    },
    ratingBar: {
        width: '75%',
        height: '100%',
        backgroundColor: 'rgba(41, 214, 128, 1)',
        borderRadius: 100
    },
    description: {
        color: 'black',
        fontFamily: 'TTN-Bold',
        fontSize: hp('2.2%'),
        textAlign: 'center'
    },
    button: {
        width: '80%',
        aspectRatio: 4.3,
        backgroundColor: Colors.accent,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontFamily: 'TTN-Bold',
        fontSize: hp('2%')
    }
})

export default RatingModal;