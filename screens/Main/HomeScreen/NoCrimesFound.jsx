import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';

// COMPONENTS
import Colors from '../../../constants/Colors';

// EXTERNAL
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const NoCrimesFound = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>No nearby crimes found!</Text>
            <View style={styles.imageContainer}>
                <Image source={require('../../../assets/images/emoji.png')} style={{ height: '100%', width: '100%' }} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '80%',
        aspectRatio: 5,
        backgroundColor: 'rgba(127, 106, 250, .1)',
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: '8%'

    },
    text: {
        fontFamily: 'TTN-Bold',
        color: Colors.accent,
        fontSize: wp('4%')
    },
    imageContainer: {
        height: '40%',
        aspectRatio: 1,
        marginLeft: '3%'
    }
})

export default NoCrimesFound;