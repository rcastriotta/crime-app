import React, { useEffect, useState } from 'react';
import { View, Dimensions, StyleSheet, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

// COMPONENTS
import Colors from '../../../constants/Colors';
import locationRating from '../../../utils/locationRating';

// REDUX
import { useSelector } from 'react-redux';


// EXTERNAL
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import grade from 'letter-grade';
import { useLinkProps } from '@react-navigation/native';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AnimatedCircle = props => {
    const crimes = useSelector(state => state.crimes.nearbyCrimes)
    const [percentage, setPercentage] = useState(null)
    const [currentColors, setCurrentColors] = useState({ main: 'gray', backgroundColor: 'rgba(128,128,128,.15)' })
    const [rating, setRating] = useState(null)

    useEffect(() => {
        if (crimes) {

            const rating = locationRating(crimes)

            setPercentage(rating)
            if (rating <= 30) {
                setCurrentColors({ main: 'rgba(213, 55, 70, 1)', backgroundColor: 'rgba(213, 55, 70, .15)' })
                setRating('High Risk')
            } else if (rating > 30 && rating < 80) {
                setCurrentColors({ main: 'rgba(236, 156, 57, 1)', backgroundColor: 'rgba(236, 156, 57, .15)' })
                setRating('Medium Risk')
            } else if (rating >= 80) {
                setCurrentColors({ main: 'rgba(41, 214, 128, 1)', backgroundColor: 'rgba(41, 214, 128, .15)' })
                setRating('Low Risk')
            }
        }
    }, [crimes])

    const ratingPressHandler = () => {
        props.showModal(percentage, currentColors)
    }
    return (
        <View style={styles.container}>
            <View style={styles.circleContainer}>
                <TouchableOpacity activeOpacity={1.0} onPress={ratingPressHandler}>
                    <AnimatedCircularProgress
                        size={windowHeight < 700 ? 195 : 220}
                        width={windowHeight < 700 ? 12 : 17}
                        fill={percentage ? percentage : 0}
                        tintColor={currentColors.main}
                        lineCap={'round'}
                        rotation={360}
                        backgroundWidth={12}

                        backgroundColor={currentColors.backgroundColor}
                        style={{
                            shadowColor: 'black',
                            shadowOpacity: .2,
                            shadowOffset: { width: 0, height: 10 },
                            shadowRadius: 12,
                        }}
                        duration={1200}
                        children={() => {
                            return (
                                <View style={{ alignItems: 'center', marginTop: '5%' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={{ ...styles.percentage }}>{Math.round(percentage)}%</Text>
                                        <Text style={styles.safeText}>Safe</Text>

                                    </View>
                                    <View style={{ height: 30, paddingHorizontal: 20, backgroundColor: currentColors.backgroundColor, alignItems: 'center', justifyContent: 'center', borderRadius: 100, marginTop: 15 }}>
                                        <Text style={{ color: currentColors.main, fontFamily: 'TTN-Bold', fontSize: 13 }}>{rating ? rating : 'Unknown'}</Text>
                                    </View>
                                </View>

                            )
                        }}
                    />
                </TouchableOpacity>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: hp('35%'),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleContainer: {
        width: 190,
        height: 190,
        borderWidth: 15,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'rgba(127, 106, 250, 0.0)',
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 30,
    },
    percentage: {
        fontFamily: 'TTN-Medium',
        color: 'white',
        fontSize: 40,
    },
    safeText: {
        color: 'gray',
        fontFamily: 'TTN-Medium',
        fontSize: 18,
        color: 'white',
        marginLeft: 5
    },
    ratingContainer: {
        marginTop: '10%',
        width: 70,
        height: '24%',
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9,
        backgroundColor: 'gray'
    }
})

export default AnimatedCircle;

/*
import React, { useEffect, useState } from 'react';
import { View, Dimensions, StyleSheet, Text } from 'react-native';

// COMPONENTS
import Colors from '../../../constants/Colors';

// REDUX
import { useSelector } from 'react-redux';


// EXTERNAL
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import grade from 'letter-grade';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AnimatedCircle = () => {
    const crimes = useSelector(state => state.crimes.nearbyCrimes)
    const [percentage, setPercentage] = useState(null)
    const [currentColors, setCurrentColors] = useState({ main: 'gray', backgroundColor: 'gray' })
    const [rating, setRating] = useState(null)

    useEffect(() => {
        if (crimes) {
            const rating = 100 / crimes.length

            // check how recent crimes are

            // check the type of crimes (shooting more unsafe than vehicle theft)

            setPercentage(rating)
            if (rating <= 50) {
                setCurrentColors({ main: 'rgba(213, 55, 70, 1)', backgroundColor: 'rgba(213, 55, 70, .15)' })
                setRating('Unsafe')
            } else if (rating > 20 && rating < 80) {
                setCurrentColors({ main: 'rgba(236, 156, 57, 1)', backgroundColor: 'rgba(236, 156, 57, .15)' })
                setRating('Risky')
            } else if (rating >= 80) {
                setCurrentColors({ main: 'rgba(41, 214, 128, 1)', backgroundColor: 'rgba(41, 214, 128, .15)' })
                setRating('Safe')
            }
        }
    }, [crimes])
    return (
        <View style={styles.container}>
            <View style={styles.circleContainer}>
                <AnimatedCircularProgress
                    size={windowHeight < 700 ? 80 : 210}
                    width={windowHeight < 700 ? 5 : 15}
                    fill={percentage ? percentage : 0}
                    tintColor={currentColors.main}
                    lineCap={'round'}
                    rotation={360}
                    backgroundColor={currentColors.backgroundColor}
                    children={() => {
                        return (
                            <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: '10%' }}>
                                <Text style={{ ...styles.percentage, color: currentColors.main }}>{grade(percentage)}</Text>
                                <View style={{ ...styles.ratingContainer, backgroundColor: currentColors.backgroundColor }}>
                                    <Text style={{ ...styles.safeText, color: currentColors.main }}>{rating}</Text>

                                </View>
                            </View>
                        )
                    }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: hp('35%'),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleContainer: {
        width: 190,
        height: 190,
        borderWidth: 15,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'rgba(127, 106, 250, 0.0)',
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 30,
    },
    percentage: {
        fontFamily: 'TTN-Medium',
        color: 'white',
        fontSize: 40,
    },
    safeText: {
        color: 'gray',
        fontFamily: 'TTN-Medium',
        fontSize: 15,
        // marginLeft: 5
    },
    ratingContainer: {
        marginTop: '10%',
        width: 70,
        height: '24%',
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9,
        backgroundColor: 'gray'
    }
})

export default AnimatedCircle;
*/