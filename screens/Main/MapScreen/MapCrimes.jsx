import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Button, Dimensions, Animated, } from 'react-native';

// EXTERNAL
import Swiper from 'react-native-swiper';
import Draggable from 'react-native-draggable';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// COMPONENTS
import CrimeReport from '../../../components/Main/CrimeReport';
import Colors from '../../../constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const MapCrimes = props => {
    let _swiper = null
    const [currentIndex, setCurrentIndex] = useState(0)

    const renderLocations = crime => {
        return (
            <CrimeReport
                key={crime.id}
                description={crime.description}
                // setSelected={() => setCrimeSelected(null)}
                address={crime.address}
                type={crime.type}
                timeSinceReport={crime.formattedDate}
                authorName={crime.authorName}
                authorId={crime.authorId}
                styles={{ ...styles.crimeReport }} />
        )
    }

    if (props.selected.constructor === Array) {
        const length = props.selected.length

        return (
            <View style={styles.swiperContainer}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity activeOpacity={0.7} containerStyle={{ overflow: 'visible' }} style={styles.exit} onPress={() => props.setCrimeSelected()}>
                        <Ionicons name={"md-close"} size={28} color={'white'} style={{ marginTop: '6%' }} />
                    </TouchableOpacity>

                    {currentIndex < length - 1 &&
                        <TouchableOpacity activeOpacity={0.7} containerStyle={{ overflow: 'visible' }} style={styles.swipe} onPress={() => _swiper.scrollBy(1)}>
                            <Text style={styles.swipeText}>{'Swipe >>'}</Text>
                        </TouchableOpacity>
                    }

                </View>

                <Swiper automaticallyAdjustContentInsets={false}
                    showsHorizontalVerticalIndicator={false}
                    showsPagination={false}
                    onIndexChanged={(index) => setCurrentIndex(index)}
                    bounces={true}
                    loop={false}
                    ref={(swiper) => { _swiper = swiper }}

                >
                    {props.selected.map(crime => renderLocations(crime))}


                </Swiper>
            </View>


        )
    }

    return (
        <View style={styles.swiperContainer}>

            <View style={styles.buttonContainer}>
                <TouchableOpacity activeOpacity={0.7} containerStyle={{ overflow: 'visible' }} style={styles.exit} onPress={() => props.setCrimeSelected()}>
                    <Ionicons name={"md-close"} size={28} color={'white'} style={{ marginTop: '6%' }} />
                </TouchableOpacity>

            </View>

            <CrimeReport
                description={props.selected.description}
                screen={'homescreen'}
                // setSelected={() => setCrimeSelected(null)}
                address={props.selected.address}
                type={props.selected.type}
                timeSinceReport={props.selected.formattedDate}
                authorName={props.selected.authorName}
                authorId={props.selected.authorId}
                styles={styles.crimeReport} />
        </View>

    )


}

const styles = StyleSheet.create({

    swiperContainer: {
        height: windowHeight < 700 ? hp('46%') : hp('37%'),
        width: '100%',
        position: 'absolute',
        bottom: 0,
    },
    container: {
        height: '38%',
        width: '100%',
        position: 'absolute',
        bottom: 0,
    },

    crimeReport: {
        backgroundColor: Colors.secondary,
        alignSelf: 'center',
        width: '90%',
        height: windowHeight < 700 ? hp('30%') : hp('23%'),
        borderRadius: 20,
        shadowColor: 'black',
        shadowOpacity: .3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        marginHorizontal: '2%',
        width: windowWidth * .96,
        marginTop: 0,
        padding: 20,

    },
    exit: {
        width: 45,
        height: 45,
        borderRadius: 100,
        backgroundColor: Colors.secondary,
        shadowColor: 'black',
        shadowOpacity: .3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible'
    },
    swipe: {
        height: 45,
        width: 100,
        borderRadius: 20,
        backgroundColor: Colors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOpacity: .3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: '3%',
        marginBottom: '5%',

    },
    swipeText: {
        color: 'white',
        fontFamily: 'TTN-Bold',
        fontSize: wp('4%')
    }


})

export default MapCrimes;