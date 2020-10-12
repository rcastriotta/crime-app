import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, ScrollView } from 'react-native';

// COMPONENTS
import InDangerModal from './InDangerModal';
import SafePlacesModal from './SafePlacesModal';
import EmergencyNumbers from './EmergencyNumbers';
import AnimatedCircle from './AnimatedCircle';
import ReportsData from './ReportsData';
import Colors from '../../../constants/Colors';
import checkIfLargeCity from '../../../utils/checkIfLargeCity';
import RatingModal from './RatingModal';

// EXTERNAL
import * as Permissions from 'expo-permissions';
import * as SMS from 'expo-sms';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MaterialIndicator } from 'react-native-indicators';
import { SafeAreaView } from 'react-navigation';


// REDUX
import { useSelector, useDispatch } from 'react-redux';
import * as crimeReportsActions from '../../../store/actions/crimeReports';
import * as locationActions from '../../../store/actions/location';


// SCREEN DIMENSIONS
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const HomeScreen = ({ navigation }) => {
    const dispatch = useDispatch()
    const name = useSelector(state => state.user.name)
    const location = useSelector(state => state.location.currentLocation)
    const [isFetching, setIsFetching] = useState(false)
    const [currentCity, setCurrentCity] = useState(null)
    const contacts = useSelector(state => state.user.emergencyContacts)
    const [amount, setAmount] = useState(0)
    const [fetchFailed, setFetchFailed] = useState(false)
    const [radius, setRadius] = useState(null)
    const [currentColors, setCurrentColors] = useState({ main: 'gray', backgroundColor: 'rgba(128,128,128,.15)' })
    const [percentage, setPercentage] = useState(0)

    // modals
    const [modalVisible, setModalVisible] = useState(false)
    const [placesModalVisible, setPlacesModalVisible] = useState(false)
    const [numbersModalVisible, setNumbersModalVisible] = useState(false)
    const [ratingModalVisible, setRatingModalVisible] = useState(false)

    const verifyPermissions = async () => {
        //will only run if permissions need to be verified
        const result = await Permissions.askAsync(Permissions.LOCATION);
        if (result.status !== 'granted') {
            Alert.alert(`Please grant location access `,
                `Go to Settings > Privacy > Location Services`, [{ text: 'Okay' }])
            return false;
        }
        return true;
    }


    // once location data is recieved/changed we grab corresponding crime data
    useEffect(() => {
        if (location) {
            setIsFetching(true)
            setFetchFailed(false)
            const coordinates = { lat: location.lat, lng: location.lng }
            const city = `${location.name}, ${location.city}, ${location.region}`
            setCurrentCity(city)
            const radius = checkIfLargeCity(location.city, location.region)
            setRadius(radius)
            dispatch(crimeReportsActions.fetchCrimes(coordinates.lat, coordinates.lng, radius, 'homescreen', 20))
                .then(() => {
                    setIsFetching(false)
                })
                .catch((err) => {
                    setIsFetching(false)
                    setFetchFailed(true)
                    console.log(err)
                })
        }
    }, [location])


    // on first load we setup location listener
    useEffect(() => {
        (async () => {
            setIsFetching(true)
            setFetchFailed(false)
            const hasPermissions = await verifyPermissions()
            if (!hasPermissions) {
                setIsFetching(false)
                return;
            }
            dispatch(locationActions.getLocation(hasPermissions)).catch((err) => {
                console.log(err)
            })
        })();
    }, [])


    const sendSMS = async () => {
        const numbers = []
        contacts.forEach(contact => contact.phoneNumbers.forEach(numberInfo => numbers.push(numberInfo.number)))

        await SMS.sendSMSAsync(
            numbers,
            `SAFETY ALERT: The person contacting you is in danger and/or needs your help.\n\nCURRENT LOCATION: ${currentCity}\n\n\nSent via 360 Safe App`,
        ).catch((err) => {
            console.log(err)
            return;
        })
    }

    const mainModalPressHandler = type => {
        if (type === 'places') {
            setPlacesModalVisible(true)
            setModalVisible(false)
        } else if (type === 'numbers') {
            setNumbersModalVisible(true)
            setModalVisible(false)
        } else if (type === 'SMS') {
            sendSMS();
            setModalVisible(false)
        }
    }

    return (
        <View>
            <ScrollView bounces={false} contentContainerStyle={amount > 1 ? { height: hp('70%') + (amount * (wp('90%') / 2.5)) } : { height: '100%' }}>
                <SafeAreaView style={styles.screen}>
                    <LinearGradient
                        // Background Linear Gradient
                        colors={['#2A2E3E', Colors.primary]}
                        style={{
                            position: 'absolute',
                            width: windowWidth,
                            height: windowHeight,
                        }}
                    />
                    <View style={styles.topContainer}>
                        <Text style={styles.name}>Hello, {name && name.split(' ')[0]}</Text>
                        <View style={{ height: '20%', width: '100%' }}>
                            {isFetching
                                ? <MaterialIndicator size={15} color={Colors.accent} style={{ alignSelf: 'flex-start' }} />
                                : !location ? <Text style={styles.locationText}>Unknown</Text> : <Text style={styles.locationText}>Near {currentCity}</Text>
                            }
                        </View>
                    </View>

                    <AnimatedCircle showModal={(percentage, currentColors) => {
                        setCurrentColors(currentColors)
                        setPercentage(percentage)
                        !isFetching && setRatingModalVisible(true)
                    }}
                    />
                    <ReportsData fetchFailed={fetchFailed} isFetching={isFetching} setAmount={(num) => setAmount(num)} radius={radius} />

                    <InDangerModal setVisible={() => setModalVisible(false)} visible={modalVisible} pressHandler={mainModalPressHandler} />
                    <SafePlacesModal radius={radius} visible={placesModalVisible} setVisible={() => setPlacesModalVisible(false)} />
                    <EmergencyNumbers visible={numbersModalVisible} setVisible={() => setNumbersModalVisible(false)} />
                    <RatingModal radius={radius} percentage={percentage} currentColors={currentColors} visible={ratingModalVisible} setVisible={() => setRatingModalVisible(false)} />

                </SafeAreaView>
            </ScrollView>
            <TouchableOpacity activeOpacity={0.7} style={styles.dangerButton} onPress={() => setModalVisible(true)}>
                <LinearGradient colors={['#AB9CFF', Colors.accent]} style={{ width: '100%', height: '100%', borderRadius: 27, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={styles.buttonText}>In Danger?</Text>

                </LinearGradient>
            </TouchableOpacity>
        </View>

    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        height: 3000

    },
    topContainer: {
        // justifyContent: 'space-between',
        width: wp('90%'),
        height: hp('10%'),
        justifyContent: 'space-evenly'

    },
    name: {
        fontSize: wp('7%'),
        color: 'white',
        fontFamily: 'TTN-Medium'
    },
    locationText: {
        fontFamily: 'TTN-Bold',
        color: Colors.accent
    },
    button: {
        width: '70%',
        height: hp('6%'),
        backgroundColor: Colors.accent,
        borderRadius: 100,
        marginTop: hp('6%'),
        alignItems: 'center',
        justifyContent: 'center',

    },
    buttonText: {
        color: 'white',
        fontFamily: 'TTN-Bold',
        fontSize: wp('4%')
    },
    dangerButton: {
        position: 'absolute',
        flex: 1,
        marginTop: hp('80%'),
        width: wp('50%'),
        aspectRatio: 3.6,
        backgroundColor: Colors.accent,
        borderRadius: 100,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        shadowColor: Colors.accent,
        shadowOpacity: .5,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,

    }
})

export default HomeScreen;